# Utility to sync data from FastF1 into the local database
from fastf1 import events
from fastf1 import get_session
from sqlalchemy.ext.asyncio import AsyncSession
import pandas as pd
from .models import Event, Session as DBSession, Lap


async def sync_season(season: int, db: AsyncSession):
    schedule = events.get_event_schedule(season)
    for _, row in schedule.iterrows():
        event = Event(season=season, name=row["EventName"])
        db.add(event)
        await db.flush()
        # Only add the race session for now
        try:
            sess = get_session(season, row["EventName"], "R")
            sess.load()
        except Exception:
            continue
        db_sess = DBSession(event_id=event.id, name="Race")
        db.add(db_sess)
        await db.flush()
        if hasattr(sess, "laps"):
            laps = sess.laps[["LapNumber", "Driver", "LapTime"]]
            for _, lap in laps.iterrows():
                lap_time = lap["LapTime"]
                if lap_time is None or pd.isna(lap_time):
                    continue
                l = Lap(
                    session_id=db_sess.id,
                    lap=int(lap["LapNumber"]),
                    driver=str(lap["Driver"]),
                    time=float(lap_time.total_seconds()),
                )
                db.add(l)
    await db.commit()
