from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

import analysis
import validation
from config import ALLOWED_ORIGINS, REGIONS
from data_loader import get_data, load_data

MONTH_PATTERN = r"^\d{4}-(0[1-9]|1[0-2])$"


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_data()
    yield


app = FastAPI(title="Climate Clue API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def prepare(region, start, end):
    df = get_data()
    validation.validate_region(region)
    s, e = validation.validate_range(df, start, end)
    series = analysis.get_series(df, region, s, e)
    return series


@app.get("/regions")
def list_regions():
    return [{"name": name, **bounds} for name, bounds in REGIONS.items()]


@app.get("/time-series")
def time_series(
    region: str,
    start: str = Query(..., pattern=MONTH_PATTERN),
    end: str = Query(..., pattern=MONTH_PATTERN),
):
    series = prepare(region, start, end)
    return {
        "region": region,
        "start": start,
        "end": end,
        "data": [
            {"date": d.strftime("%Y-%m"), "value": round(float(v), 3)}
            for d, v in series.items()
        ],
    }


@app.get("/trend-result")
def trend_result(
    region: str,
    start: str = Query(..., pattern=MONTH_PATTERN),
    end: str = Query(..., pattern=MONTH_PATTERN),
):
    series = prepare(region, start, end)
    validation.validate_enough_data(series)
    return analysis.analyse(series, region, start, end)


@app.get("/compare")
def compare(
    regions: str,
    start: str = Query(..., pattern=MONTH_PATTERN),
    end: str = Query(..., pattern=MONTH_PATTERN),
):
    names = [r.strip() for r in regions.split(",") if r.strip()]
    if len(set(names)) != len(names) or not 2 <= len(names) <= 3:
        raise HTTPException(
            status_code=422, detail="Provide 2 or 3 different regions"
        )
    results = []
    for name in names:
        series = prepare(name, start, end)
        validation.validate_enough_data(series)
        results.append(analysis.analyse(series, name, start, end))
    return {"start": start, "end": end, "results": results}