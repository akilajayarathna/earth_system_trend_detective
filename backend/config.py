import os

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "gldas_region_temperature.csv"

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

MIN_MONTHS = 36

REGIONS = {
    "Sri Lanka": {"west": 78, "south": 6, "east": 82, "north": 10},
    "South Asia": {"west": 70, "south": 10, "east": 90, "north": 30},
    "North Asia": {"west": 60, "south": 50, "east": 120, "north": 70},
}