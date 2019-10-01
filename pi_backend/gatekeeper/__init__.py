from flask import Flask, jsonify

from gatekeeper.config import Config
from gatekeeper.controllers import register_blueprints
from gatekeeper.models import Base, db, ma
from gatekeeper.utils import update_all_status
from gatekeeper.whiteboard import toggle_status

app = Flask(__name__)

app.config.from_object(Config)

register_blueprints(app)

db.init_app(app)
ma.init_app(app)

with app.app_context():
    Base.metadata.create_all(bind=db.engine)
    toggle_status(2)
    update_all_status()


@app.route("/status")
def healthcheck():
    update_all_status()
    return jsonify({"status": "success", "data": {"message": "Online"}})
