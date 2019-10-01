from flask import Blueprint, current_app, request
from flask_restful import Api, Resource
from marshmallow import ValidationError

import gatekeeper.whiteboard as whiteboard
from gatekeeper.controllers.response import Error, Success
from gatekeeper.models.team import (
    Team,
    post_team_schema,
    team_patch_schema,
    team_put_schema,
    team_schema,
    teams_schema,
)
from gatekeeper.models.user import User
from gatekeeper.utils import update_all_status

teams_bp = Blueprint("teams_controller", __name__)
api = Api(teams_bp)


@api.resource("/api/teams/<string:team_name>")
class TeamApi(Resource):
    def get(self, team_name):
        try:
            team = Team.get_team(team_name)
            result = team_schema.dump(team)
            return Success(result).to_json(), 200
        except ValidationError as err:
            current_app.log_exception(err)
            return Error(str(err)).to_json(), 400

    def put(self, team_name):
        try:
            team = Team.get_team(team_name)
            data = team_put_schema.load(request.get_json())
            for k, v in data.items():
                setattr(team, k, v)
            team.save()
            update_all_status()
            return None, 204
        except ValidationError as err:
            return Error(str(err)).to_json(), 400

    def patch(self, team_name):
        try:
            team = Team.get_team(team_name)
            data = team_patch_schema.load(request.get_json())
            board_position = data.get("board_position")
            status = data.get("status")

            if board_position is not None:
                team.set_board_position(board_position)

            if team.board_position is not None and status is not None:
                team.status = status
            update_all_status()
            team.save()
            return None, 204
        except ValidationError as err:
            current_app.log_exception(err)
            return Error(str(err)).to_json(), 400
        except whiteboard.WhiteboardError as err:
            current_app.log_exception(err)
            return Error(str(err)).to_json(), 400

    def delete(self, team_name):
        try:
            team = Team.get_team(team_name)
            team.delete()
            update_all_status()
            return None, 204
        except ValidationError as err:
            return Error(str(err)).to_json(), 400


@api.resource("/api/teams/")
class TeamsApi(Resource):
    def get(self):
        teams = Team.get_all()
        response = teams_schema.dump(teams)
        return Success(response).to_json(), 200

    def post(self):
        try:
            data = post_team_schema.load(request.get_json())
            Team.validate_non_existance(data.get("name"))
            position = data.get("board_position")
            team = Team()
            team.name = data.get("name")
            team.location = data.get("location")
            if position is not None:
                team.set_board_position(position)
            team.save()
            update_all_status()
            return Success(f"Team: {team.name} created").to_json(), 204
        except ValidationError as err:
            current_app.log_exception(err)
            return Error(str(err)).to_json(), 400


@api.resource("/api/teams/<string:team_name>/<string:user_name>")
class TeamAndUser(Resource):
    def delete(self, team_name, user_name):
        try:
            team = Team.get_team(team_name)
            user = User.get_user(user_name)
            team._members.remove(user)
            team.save()
            return None, 204
        except ValueError:
            return (
                Error(f"User: {user_name} not found on Team: {team_name}").to_json(),
                404,
            )
        except ValidationError as err:
            return Error(str(err)).to_json(), 400
