import { Link, useSearchParams } from "react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { Loading, ErrorBox } from "../components/Status.jsx";
import useApi from "../hooks/useApi.js";
import { getRegions, getCompare } from "../api.js";
import { formatP, formatChange, formatRange } from "../utils/format.js";
import { AXIS, TOOLTIP, btnPrimary, btnGhost } from "../utils/ui.js";

const COLORS = ["#fbbf24", "#22d3ee", "#f472b6"];

export default function Compare() {
  const [params] = useSearchParams();
  const start = params.get("start");
  const end = params.get("end");

  const { data, error, loading } = useApi(async () => {
    const regions = await getRegions();
    const names = regions.map((r) => r.name).join(",");
    return getCompare({ regions: names, start, end });
  }, [start, end]);

  if (loading) return <Loading text="Cross-checking all suspects" />;
  if (error) return <ErrorBox message={error} />;

  const rowsByYear = {};
  data.results.forEach((r) => {
    r.annual_means.forEach((a) => {
      if (!rowsByYear[a.year]) rowsByYear[a.year] = { year: a.year };
      rowsByYear[a.year][r.region] = a.value;
    });
  });
  const rows = Object.values(rowsByYear).sort((a, b) => a.year - b.year);

  return (
    <div>
      <PageHeader
        eyebrow="Step 05 · Cross-check"
        title="Compare regions"
        subtitle={formatRange(start, end)}
      />

      <Panel label="Annual mean temperature (°C)">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" {...AXIS} />
            <YAxis unit="°C" domain={["auto", "auto"]} {...AXIS} />
            <Tooltip {...TOOLTIP} />
            <Legend wrapperStyle={{ color: "#cbd5e1" }} />
            {data.results.map((r, i) => (
              <Line
                key={r.region}
                type="monotone"
                dataKey={r.region}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel label="Suspect lineup" className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Trend</th>
              <th className="px-4 py-3">Sen's slope (°C/year)</th>
              <th className="px-4 py-3">Total change (°C)</th>
              <th className="px-4 py-3">p-value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.results.map((r, i) => (
              <tr key={r.region} className="transition hover:bg-slate-800/50">
                <td className="px-4 py-4 font-medium text-slate-100">
                  <span
                    className="mr-3 inline-block h-3 w-3 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {r.region}
                </td>
                <td className="px-4 py-4 capitalize text-slate-300">
                  {r.trend}
                </td>
                <td className="px-4 py-4 text-slate-300">
                  {r.sens_slope_per_year}
                </td>
                <td className="px-4 py-4 text-slate-300">
                  {formatChange(r.total_change_c)}
                </td>
                <td className="px-4 py-4 text-slate-300">
                  {formatP(r.p_value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-slate-500">
          Total change = Sen's slope x number of years in the selected range. It
          is an estimate from the trend, not the difference between the first
          and last values.
        </p>
      </Panel>

      <div className="mt-8 flex justify-between">
        <Link to={`/verdict?${params.toString()}`} className={btnGhost}>
          Back
        </Link>
        <Link to="/choose" className={btnPrimary}>
          Open a new case
        </Link>
      </div>
    </div>
  );
}