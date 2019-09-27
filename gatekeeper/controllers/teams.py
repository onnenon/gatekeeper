from flask import Blueprint, current_app, request
from flask_restful import Api, Resource
from marshmallow import ValidationError

from gatekeeper.controllers.response import Error, Fail, Success
from gatekeeper.models.team import Team, team_schema, teams_schema, team_put_schema


class TeamApi(Resource):
    def get(self, team_name):
        team = Team.get_team(team_name)
        if team is None:
            return Error(f"Team {team_name} does not exist.").to_json(), 404
        result = team_schema.dump(team)
        return Success(result).to_json(), 200

    def put(self, team_name):
        team = Team.get_team(team_name)
        if team is None:
            return Error(f"Team {team_name} does not exist.").to_json(), 404
        try:
            data = team_put_schema.load(request.get_json())
            team.status = data["status"]
            team.location = data["location"]
            team.board_position = data["board_position"]
            team.save()
            return None, 204
        except ValidationError as err:
            return Error(str(err)).to_json(), 400

    def delete(self, team_name):
        team = Team.get_team(team_name)
        if team is None:
            return Fail(f"Team {team_name} does not exist.").to_json(), 404
        team.delete()
        return None, 204


class TeamsApi(Resource):
    def get(self):
        teams = Team.get_all()
        response = teams_schema.dump(teams)
        return Success(response).to_json(), 200

    def post(self):
        try:
            data = team_schema.load(request.get_json())
            current_app.logger.debug(data)
            team = Team.get_team(data["name"])
            if team is not None:
                return Fail(f"Team {team.name} already exists").to_json(), 400

            # Check board position things
            team = Team(name=data["name"])
            team.save()
            return Success(f"Team {team.name} created").to_json(), 204
        except ValidationError as err:
            return Error(str(err)).to_json(), 400


teams_bp = Blueprint("teams", __name__)

api = Api(teams_bp)

api.add_resource(TeamsApi, "/api/teams/")
api.add_resource(TeamApi, "/api/teams/<string:team_name>")
