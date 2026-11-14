# Climate Clue

**Earth System Trend Detective** | NASA Space Apps Challenge 2026 (Colombo)

Climate Clue is a web app that investigates temperature trends like a detective. Pick a region and a time window, look at the raw evidence, find the pattern, and get a statistical verdict on whether the temperature is really changing or the change is just noise.


## The question

Is the air temperature really changing in a region, and is that change statistically meaningful? Climate Clue answers this for three regions using NASA land-surface data, the Mann-Kendall trend test and Sen's slope.

## Data

| Item | Value |
|---|---|
| Dataset | GLDAS Noah Land Surface Model L4 monthly 0.25 x 0.25 degree V2.1 (`GLDAS_NOAH025_M`) |
| Provider | NASA GES DISC |
| DOI | https://doi.org/10.5067/SXAVCZFAQLNO |
| Variable | `Tair_f_inst` (air temperature, Kelvin, converted to Celsius) |
| Coverage | Global land, 2000 to present |
| Access | `earthaccess` Python library with an Earthdata Login account |

### Regions

| Region | West | South | East | North |
|---|---|---|---|---|
| Sri Lanka | 78 | 6 | 82 | 10 |
| South Asia | 70 | 10 | 90 | 30 |
| North Asia | 60 | 50 | 120 | 70 |

Each region value is the mean temperature over all land grid cells inside its bounding box.

## Method

1. Download the monthly GLDAS files and cut each region from the global grid.
2. Convert Kelvin to Celsius and average over the region's land cells. Ocean cells carry a fill value, so they are treated as missing and skipped.
3. Save the monthly regional series as a small CSV.
4. For a user-selected range, run the **seasonal Mann-Kendall test** (12 months per season) to decide whether a monotonic trend exists. Seasonal handling prevents the yearly temperature cycle from being mistaken for a trend.
5. Estimate the trend size with **Sen's slope**, reported in degrees Celsius per year.
6. Report the p-value. A trend is called significant when p < 0.05. Ranges shorter than 36 months are rejected.
7. Compute annual means and a trend line from Sen's slope for the charts.

"Total change" in the UI is Sen's slope multiplied by the number of years in the selected range. It is an estimate from the trend, not the difference between the first and last values.

## Architecture

```
NASA GES DISC -> earthaccess -> raw NetCDF -> xarray/pandas -> processed CSV
                                                                   |
                                          FastAPI (loader -> validation -> analysis)
                                                                   |
                                                       JSON over HTTPS
                                                                   |
                                                         React frontend
```

Three layers:

- **Offline data pipeline** (run once): download, region cut, unit conversion, CSV export.
- **FastAPI backend**: loads the CSV at startup, validates input, runs the statistics, returns JSON.
- **React frontend**: the investigation flow (Case, Evidence, Pattern, Verdict, Cross-check).

### API

All endpoints are `GET` and return JSON. Months use the `YYYY-MM` format.

| Endpoint | Purpose |
|---|---|
| `/regions` | List regions with their bounding boxes |
| `/time-series?region=&start=&end=` | Monthly temperature series for a region and range |
| `/trend-result?region=&start=&end=` | Mann-Kendall result, Sen's slope, p-value, annual means, trend line |
| `/compare?regions=a,b,c&start=&end=` | Trend results for 2 or 3 regions |

Invalid input returns clear errors: 404 for an unknown region, 422 for a bad range or too little data, 400 for a range outside the data.

## Tech stack

- **Data:** Python, earthaccess, xarray, NetCDF4, pandas
- **Backend:** FastAPI, Uvicorn, pymannkendall, pandas, NumPy
- **Frontend:** React, Vite, React Router, Recharts, Tailwind CSS

## Project structure

```
earth_system_trend_detective/
├── data-pipeline/     # download and processing notebook, raw data (not committed)
├── backend/
│   ├── data/gldas_region_temperature.csv
│   ├── config.py
│   ├── data_loader.py
│   ├── validation.py
│   ├── analysis.py
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── public/regions/    # region photos
    └── src/               # pages, components, layout, hooks, utils
```

## Run it locally

### 1. Data pipeline (only needed to rebuild the CSV)

Requires a free [Earthdata Login](https://urs.earthdata.nasa.gov) account.

```
pip install earthaccess xarray netcdf4 dask pandas
```

Run the notebook in `data-pipeline/` to log in, download `GLDAS_NOAH025_M` v2.1, and export `gldas_region_temperature.csv`. Copy the CSV to `backend/data/`. The repository already includes a processed CSV, so you can skip this step.

### 2. Backend

```
cd backend
python -m venv venv
source venv/Scripts/activate      # Git Bash on Windows
# venv\Scripts\activate           # Windows CMD / PowerShell
# source venv/bin/activate        # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/docs to try the endpoints.

### 3. Frontend

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_API_URL` | Frontend (build time) | Backend base URL. Defaults to `http://localhost:8000` |
| `ALLOWED_ORIGINS` | Backend | Comma-separated frontend origins allowed by CORS. Defaults to `http://localhost:5173` |

## Deployment

Deployed on Render: the backend as a Web Service (root `backend`, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`) and the frontend as a Static Site (root `frontend`, build `npm install && npm run build`, publish `dist`, rewrite `/*` to `/index.html`). On the free plan the backend sleeps after inactivity, so the first request can take up to about a minute.

## Limitations

- GLDAS Noah is a **land-only** model. Ocean cells have no values, so regional means include land cells only. This matters most for Sri Lanka, where the box contains a lot of sea and only a few land cells.
- The 0.25 degree grid is coarse for a small island, and the region boxes are rectangles that cut across country borders.
- The data is a model product, not station observations.
- Mann-Kendall detects a consistent monotonic trend. It does not explain the cause of a trend, and a short range can give an inconclusive result.
- Sen's slope and "total change" assume a roughly linear trend over the chosen range.

## Data and references

- GLDAS Noah Land Surface Model L4 monthly 0.25 x 0.25 degree V2.1, NASA GES DISC, https://doi.org/10.5067/SXAVCZFAQLNO
- `earthaccess`, https://github.com/nsidc/earthaccess
- `pymannkendall`, https://github.com/mmhs013/pyMannKendall
- NASA Giovanni, https://giovanni.gsfc.nasa.gov/ (resource listed by the challenge)

Region photos: `<photo credits>`

## AI tools disclosure

`<Describe how AI tools were used in this project, following the NASA Space Apps rules.>`

## Team

`Team Terra Trace`

## Acknowledgements

NASA Space Apps Challenge 2026, NASA GES DISC and the Goddard Earth Sciences Data and Information Services Center.