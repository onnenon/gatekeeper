from flask import Blueprint, current_app, request
from flask_restful import Api, Resource
from marshmallow import ValidationError

from gatekeeper.controllers.response import Error, Success
from gatekeeper.models.team import Team
from gatekeeper.models.user import (
    User,
    user_patch_schema,
    user_put_schema,
    user_schema,
    users_post_schema,
    users_schema,
)

users_bp = Blueprint("users", __name__)
api = Api(users_bp)


@api.resource("/api/users/<string:username>")
class UserApi(Resource):
    def get(self, username):
        try:
            user = User.get_user(username)
            result = user_schema.dump(user)
            return Success(result).to_json(), 200
        except ValidationError as err:
            return Error(str(err)).to_json(), 400

    def patch(self, username):
        try:
            user = User.get_user(username)
            teams = user_patch_schema.load(request.get_json()).get("teams")
            current_app.logger.debug(teams)
            for t in teams:
                team_name = t.get("name")
                team = Team.get_team(team_name)
                user._teams.append(team)
            user.save()
            return None, 204
        except ValidationError as err:
            return Error(str(err)).to_json(), 400

    def put(self, username):
        try:
            user = User.get_user(username)
            user._teams = []
            teams = user_put_schema.load(request.get_json()).get("teams")
            current_app.logger.debug(teams)
            for t in teams:
                team_name = t.get("name")
                team = Team.get_team(team_name)
                user._teams.append(team)
            user.save()
            return None, 204
        except ValidationError as err:
            return Error(str(err)).to_json(), 400

    def delete(self, username):
        try:
            user = User.get_user(username)
            user.delete()
            return None, 204
        except ValidationError as err:
            return Error(str(err)).to_json(), 400


@api.resource("/api/users/")
class UsersApi(Resource):
    def get(self):
        users = User.get_all()
        users_json = users_schema.dump(users)
        return Success(users_json).to_json(), 200

    def post(self):
        try:
            data = users_post_schema.load(request.get_json())
            username = data["username"]
            User.validate_non_existance(username)
            new_user = User(username=username)
            teams = data.get("teams")
            if teams is not None and len(teams) > 0:
                for t in teams:
                    team_name = t.get("name")
                    team = Team.get_team(team_name)
                    new_user._teams.append(team)
            new_user.save()
            return Success(f"User: {username} created successfully").to_json(), 201
        except ValidationError as err:
            return Error(str(err)).to_json(), 400
