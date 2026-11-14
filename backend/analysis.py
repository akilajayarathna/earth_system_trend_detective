import numpy as np
import pymannkendall as mk


def get_series(df, region, start, end):
    return df.loc[start:end, region].dropna()


def annual_means(series):
    return series.groupby(series.index.year).mean()


def trend_stats(series):
    r = mk.seasonal_test(series.values, period=12)
    return {
        "trend": r.trend,
        "p_value": float(r.p),
        "sens_slope_per_year": float(r.slope),
    }


def trend_line(yearly, slope_per_year):
    years = yearly.index.values.astype(float)
    intercept = np.median(yearly.values - slope_per_year * years)
    return [
        {"year": int(y), "value": round(float(slope_per_year * y + intercept), 3)}
        for y in years
    ]


def analyse(series, region, start, end):
    stats = trend_stats(series)
    yearly = annual_means(series)
    years_covered = len(series) / 12
    return {
        "region": region,
        "start": start,
        "end": end,
        "trend": stats["trend"],
        "p_value": round(stats["p_value"], 6),
        "sens_slope_per_year": round(stats["sens_slope_per_year"], 4),
        "total_change_c": round(stats["sens_slope_per_year"] * years_covered, 2),
        "annual_means": [
            {"year": int(y), "value": round(float(v), 3)} for y, v in yearly.items()
        ],
        "trend_line": trend_line(yearly, stats["sens_slope_per_year"]),
    }