import os


class Config(object):
    ENV = os.getenv("FLASK_ENV", "production")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_DATABASE_URI = "postgresql://{}:{}@{}:{}/{}".format(
        os.getenv("API_DB_USERNAME", "admin"),
        os.getenv("API_DB_PASSWORD", "pass"),
        os.getenv("API_DB_HOST", "localhost"),
        os.getenv("API_DB_PORT", "5432"),
        os.getenv("API_DB_NAME", "gate_db"),
    )

    USE_BOARD = os.getenv("USE_BOARD", None)
    ROW_COUNT = 20
