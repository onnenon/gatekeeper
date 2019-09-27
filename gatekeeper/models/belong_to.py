from gatekeeper.models import db, Base


class BelongsTo(Base):
    __tablename__ = "belongs_to"

    user = db.Column(db.Integer(), db.ForeignKey("users.id"))
    team = db.Column(db.String(30), db.ForeignKey("team.name"))
    db.PrimaryKeyConstraint()
