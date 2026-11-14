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
import { getTrendResult } from "../api.js";
import { formatRange } from "../utils/format.js";
import { AXIS, TOOLTIP, btnPrimary, btnGhost } from "../utils/ui.js";

export default function Trend() {
  const [params] = useSearchParams();
  const region = params.get("region");
  const start = params.get("start");
  const end = params.get("end");

  const { data, error, loading } = useApi(
    () => getTrendResult({ region, start, end }),
    [region, start, end]
  );

  if (loading) return <Loading text="Looking for patterns" />;
  if (error) return <ErrorBox message={error} />;

  const lineByYear = {};
  data.trend_line.forEach((p) => {
    lineByYear[p.year] = p.value;
  });
  const rows = data.annual_means.map((a) => ({
    year: a.year,
    annualMean: a.value,
    trendLine: lineByYear[a.year],
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Step 03 · Exhibit B"
        title="The pattern"
        subtitle={`${region} · ${formatRange(start, end)}`}
      />

      <Panel label="Annual mean temperature with Sen's slope trend line">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" {...AXIS} />
            <YAxis unit="°C" domain={["auto", "auto"]} {...AXIS} />
            <Tooltip {...TOOLTIP} />
            <Legend wrapperStyle={{ color: "#cbd5e1" }} />
            <Line
              type="monotone"
              dataKey="annualMean"
              name="Annual mean"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ r: 3, fill: "#22d3ee" }}
            />
            <Line
              type="linear"
              dataKey="trendLine"
              name="Trend line"
              stroke="#fbbf24"
              strokeWidth={2}
              strokeDasharray="8 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <div className="mt-8 flex justify-between">
        <Link to={`/raw-evidence?${params.toString()}`} className={btnGhost}>
          Back
        </Link>
        <Link to={`/verdict?${params.toString()}`} className={btnPrimary}>
          Reach a verdict
        </Link>
      </div>
    </div>
  );
}