import pandas as pd
from fastapi import HTTPException

from config import REGIONS, MIN_MONTHS


def validate_region(region):
    if region not in REGIONS:
        raise HTTPException(status_code=404, detail=f"Unknown region: {region}")


def parse_month(value):
    try:
        return pd.Timestamp(f"{value}-01")
    except ValueError:
        raise HTTPException(
            status_code=422, detail=f"Invalid month: {value}. Use YYYY-MM."
        )


def validate_range(df, start, end):
    s = parse_month(start)
    e = parse_month(end)
    if s >= e:
        raise HTTPException(status_code=422, detail="start must be before end")
    if s < df.index.min() or e > df.index.max():
        raise HTTPException(
            status_code=400,
            detail=(
                f"Range must be within data: "
                f"{df.index.min():%Y-%m} to {df.index.max():%Y-%m}"
            ),
        )
    return s, e


def validate_enough_data(series):
    if len(series) < MIN_MONTHS:
        raise HTTPException(
            status_code=422,
            detail=(
                f"Not enough data for trend analysis: {len(series)} months, "
                f"minimum is {MIN_MONTHS}"
            ),
        )