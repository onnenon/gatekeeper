def register_blueprints(app):
    from gatekeeper.controllers.users import users_bp
    from gatekeeper.controllers.teams import teams_bp

    app.register_blueprint(users_bp)
    app.register_blueprint(teams_bp)
