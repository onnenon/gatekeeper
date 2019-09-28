from enum import Enum

import board
import neopixel

_pixels = neopixel.NeoPixel(board.D12, 1)

_colors = {"red": (10, 0, 0), "green": (0, 10, 0), "blue": (0, 0, 10)}


class WhiteboardError(Exception):
    pass


class WhiteboardStatus(Enum):
    OUT = 0
    IN = 1


def set_status(position, status):
    if position >= len(_pixels):
        raise WhiteboardError(
            "position {} exceeds row count {}".format(position, len(_pixels))
        )
    if status == WhiteboardStatus.OUT.vaue:
        _pixels[position] = _colors["red"]
    elif status == WhiteboardStatus.IN.value:
        _pixels[position] = _colors["green"]
    else:
        _pixels[position] = _colors["blue"]
