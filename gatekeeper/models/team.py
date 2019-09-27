from gatekeeper.models import base, db, ma


class Team(base):

    __tablename__ = "teams"

    name = db.Column(db.String(30), primary_key=True, nullable=False)
    status = db.Column(db.Integer(), default=0)
    location = db.Column(db.String(30), default="vault")
    board_position = db.Column(db.Integer(), unique=True)
    members = db.relationship("User", secondary="belongs_to")

    def save(self):
        """Addes the non-existing Team to the DB."""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Deletes the Team from the DB."""
        db.session.delete(self)
        db.session.commit()

    def is_in_office(self):
        for member in self.members:
            if member.checked_in:
                return True
        return False

    def set_board_position(self, position):
        old = Team.get_at_board_position(position)
        if old is not None:
            old.board_position = None
            old.save()
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
    def get_all():
        """Returns a list of all Team objects in the Teams table"""
        return Team.query.all()

    @staticmethod
    def get_team(name):
        """Returns a Team Object for a specific Team, if it exists.

        Args:
            teamname: teamname to search for
        """
        return Team.query.filter_by(name=name).first()

    @staticmethod
    def get_at_board_position(position):
        return Team.query.filter_by(board_position=position)


class TeamSchema(ma.Schema):
    class Meta:
        fields = ("name", "in_office", "location", "board_position")


team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)