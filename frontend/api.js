const BASE_URL = "https://earth-system-trend-detective-ten.vercel.app";

async function get(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}${path}?${query}`);
  const body = await res.json();
  if (!res.ok) {
    const detail =
      typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    throw new Error(detail);
  }
  return body;
}

export const getRegions = () => get("/regions");
export const getTimeSeries = (params) => get("/time-series", params);
export const getTrendResult = (params) => get("/trend-result", params);
export const getCompare = (params) => get("/compare", params);