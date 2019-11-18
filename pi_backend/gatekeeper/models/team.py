from marshmallow import ValidationError, fields

from gatekeeper.config import Config
from gatekeeper.exceptions import NotFoundError
from gatekeeper.models import Base, db, ma


class Team(Base):

    __tablename__ = "teams"

    name = db.Column(db.String(30), primary_key=True, nullable=False)
    status = db.Column(db.Integer(), default=0)
    location = db.Column(db.String(30))
    building = db.Column(db.String(30), default="vault")
    board_position = db.Column(db.Integer(), unique=True)
    _members = db.relationship("User", secondary="belongs_to")

    def save(self):
        """Updated the Team to the DB."""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Deletes the Team from the DB."""
        self._members.clear()
        db.session.delete(self)
        db.session.commit()

    def set_board_position(self, position):
        """Sets the board position of the Team to the given position.

        Args:
            position: the int to set the Team's position to.

        Raises:
            ValidationError: given position not in range, or position is taken by another team.

        """
        if int(position) not in range(Config.ROW_COUNT):
            raise ValidationError(f"Board position: {position} not in range")
        old = Team.get_team_at_position(position)
        if old is not None:
            raise ValidationError(
                f"Board position: {position} already taken by {old.name}"
            )
        self.board_position = position
        self.save()

    def to_json(self):
        """Returns a JSON representation of the team."""
        return {
            "name": self.name,
            "status": self.status,
            "location": self.location,
            "board_position": self.board_position,
        }

    @staticmethod
    def create_team_from_team(old_team, team_name):
        new_team = Team()

        new_team = Team()
        new_team.name = team_name
        new_team.board_position = old_team.board_position
        old_team.board_position = None
        new_team.status = old_team.status
        new_team.location = old_team.location
        new_team.building = old_team.building
        db.session.add(old_team)
        db.session.add(new_team)
        db.session.commit()
        return new_team

    @staticmethod
    def get_all():
        """Returns a list of all Team objects in the Teams table"""
        return Team.query.all()

    @staticmethod
    def get_team(name):
        """Returns a Team Object for a specific Team, if it exists.

        Args:
            teamname: teamname to search for

        Raises:
            NotFoundError: if team does not exist.
        """
        team = Team.query.filter_by(name=name).first()
        if team is None:
            raise NotFoundError(f"Team: {name} does not exist.")
        return team

    @staticmethod
    def get_team_at_position(position):
        """Returns the Team Object for the team at the given position or None
            if no team holds the position.

        Args:
            position: the index of the team to return.
        """
        return Team.query.filter_by(board_position=position).first()

    @staticmethod
    def validate_non_existance(name):
        """Check to see if a team exists with the given name.

        Args:
            name: Name of team to search for.

        Raises:
            ValidationError: if team exists.
        """
        team = Team.query.filter_by(name=name).first()
        if team is not None:
            raise ValidationError(f"Team: {name} already exists.")

    @staticmethod
    def validate_free_board_position(position):
        """Check to see if a team occupies the given board position.

        Args:
            position: Position to validate

        Raises:
            ValidationError: If team occupies the given board position.
        """
        team = Team.query.filter_by(board_position=int(position)).first()
        if team is not None:
            raise ValidationError(f"Team already exists at board_position: {position}")


class TeamSchema(ma.Schema):
    members = fields.Method("get_members")

    def get_members(self, team):
        return [member.to_json() for member in team._members]

    class Meta:
        fields = ("name", "status", "location", "board_position", "members")


class TeamsSchema(ma.Schema):
    class Meta:
        fields = ("name", "status", "location", "board_position")


class PostTeamSchema(ma.Schema):
    class Meta:
        fields = ("name", "location", "building", "board_position")


class TeamPutSchema(ma.Schema):
    # Need to add more things here
    location = fields.String(required=True)


class TeamPatchSchema(ma.Schema):
    class Meta:
        fields = ("status", "board_position", "name", "location", "building")


team_schema = TeamSchema()

post_team_schema = PostTeamSchema()

teams_schema = TeamsSchema(many=True)

team_put_schema = TeamPutSchema()
team_patch_schema = TeamPatchSchema()
