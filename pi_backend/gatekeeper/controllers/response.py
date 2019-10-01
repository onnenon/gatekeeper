class Response:
    """Object for API responses."""

    def __init__(self, status="", data={}):
        self.status = status
        self.data = data

    def to_json(self):
        return {"status": self.status, "data": self.data}


class Success(Response):
    def __init__(self, data):
        self.status = "success"
        self.data = data


class Error(Response):
    def __init__(self, data):
        self.status = "error"
        self.data = {"message": data}
