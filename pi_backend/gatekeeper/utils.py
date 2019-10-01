from gatekeeper.config import Config
from gatekeeper.models.team import Team
from gatekeeper.whiteboard import set_status


def update_all_status():
    for i in range(Config.ROW_COUNT):
        team = Team.get_team_at_position(i)
        if team is not None:
            set_status(i, team.status)
        else:
            set_status(i, 2)
