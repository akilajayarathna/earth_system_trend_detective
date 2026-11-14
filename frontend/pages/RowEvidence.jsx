import { Link, useSearchParams } from "react-router";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { Loading, ErrorBox } from "../components/Status.jsx";
import useApi from "../hooks/useApi.js";
import { getTimeSeries } from "../api.js";
import { formatRange } from "../utils/format.js";
import { AXIS, TOOLTIP, btnPrimary, btnGhost } from "../utils/ui.js";

export default function RowEvidence() {
  const [params] = useSearchParams();
  const region = params.get("region");
  const start = params.get("start");
  const end = params.get("end");

  const { data, error, loading } = useApi(
    () => getTimeSeries({ region, start, end }),
    [region, start, end]
  );

  if (loading) return <Loading text="Collecting raw evidence" />;
  if (error) return <ErrorBox message={error} />;

  const values = data.data.map((d) => d.value);
  const min = Math.min(...values).toFixed(1);
  const max = Math.max(...values).toFixed(1);
  const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);

  return (
    <div>
      <PageHeader
        eyebrow="Step 02 · Exhibit A"
        title="Raw evidence"
        subtitle={`${region} · ${formatRange(start, end)}`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Coldest month", `${min} °C`],
          ["Average", `${mean} °C`],
          ["Hottest month", `${max} °C`],
        ].map(([label, value], i) => (
          <div
            key={label}
            style={{ animationDelay: `${i * 100}ms` }}
            className="animate-fade-up rounded-xl border border-slate-700/70 bg-slate-900/70 p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
              {label}
            </p>
            <p className="mt-2 font-typewriter text-3xl text-amber-300">
              {value}
            </p>
          </div>
        ))}
      </div>

      <Panel label="Monthly mean air temperature (°C)" className="mt-6">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data.data}>
            <defs>
              <linearGradient id="evidenceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" minTickGap={50} {...AXIS} />
            <YAxis unit="°C" domain={["auto", "auto"]} {...AXIS} />
            <Tooltip {...TOOLTIP} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#evidenceFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <div className="mt-8 flex justify-between">
        <Link to="/choose" className={btnGhost}>
          Back
        </Link>
        <Link to={`/trend?${params.toString()}`} className={btnPrimary}>
          Find the pattern
        </Link>
      </div>
    </div>
  );
}