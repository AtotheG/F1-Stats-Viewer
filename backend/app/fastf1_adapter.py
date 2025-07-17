import fastf1
from fastf1 import events
from functools import lru_cache

@lru_cache(maxsize=128)
def get_session(season: int, gp: str, session: str):
    sess = fastf1.get_session(season, gp, session)
    sess.load()
    return sess
