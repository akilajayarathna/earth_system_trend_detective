import pandas as pd

from config import DATA_PATH

_df = None


def load_data():
    global _df
    _df = pd.read_csv(DATA_PATH, index_col=0, parse_dates=True).sort_index()
    return _df


def get_data():
    if _df is None:
        raise RuntimeError("Data not loaded")
    return _df