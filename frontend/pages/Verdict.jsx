import { Link, useSearchParams } from "react-router";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { Loading, ErrorBox } from "../components/Status.jsx";
import useApi from "../hooks/useApi.js";
import { getTrendResult } from "../api.js";
import { formatRange, formatP, formatChange } from "../utils/format.js";
import { btnPrimary, btnGhost } from "../utils/ui.js";

function verdictFor(trend, significant) {
  if (significant && trend === "increasing")
    return {
      text: "Warming confirmed",
      style: "border-amber-400 text-amber-400",
    };
  if (significant && trend === "decreasing")
    return {
      text: "Cooling confirmed",
      style: "border-cyan-300 text-cyan-300",
    };
  return {
    text: "Inconclusive",
    style: "border-slate-400 text-slate-300",
  };
}

export default function Verdict() {
  const [params] = useSearchParams();
  const region = params.get("region");
  const start = params.get("start");
  const end = params.get("end");

  const { data, error, loading } = useApi(
    () => getTrendResult({ region, start, end }),
    [region, start, end]
  );

  if (loading) return <Loading text="The court is deliberating" />;
  if (error) return <ErrorBox message={error} />;

  const significant = data.p_value < 0.05;
  const verdict = verdictFor(data.trend, significant);

  const cards = [
    {
      label: "Trend direction",
      value: data.trend,
      note: "Mann-Kendall (seasonal) result",
      capitalize: true,
    },
    {
      label: "Sen's slope",
      value: `${data.sens_slope_per_year}`,
      note: "°C per year",
    },
    {
      label: "Total change",
      value: `${formatChange(data.total_change_c)} °C`,
      note: "Slope x years in the range",
    },
    {
      label: "p-value",
      value: formatP(data.p_value),
      note: significant
        ? "Significant at the 0.05 level"
        : "Not significant at the 0.05 level",
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Step 04 · The ruling"
        title="Verdict"
        subtitle={`${region} · ${formatRange(start, end)}`}
      />

      <Panel className="flex flex-col items-center py-14">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-400">
          Case ruling
        </p>
        <p
          className={`mt-6 animate-stamp rounded-lg border-4 px-8 py-4 font-typewriter text-4xl uppercase tracking-widest md:text-6xl ${verdict.style}`}
        >
          {verdict.text}
        </p>
      </Panel>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={c.label}
            style={{ animationDelay: `${i * 120}ms` }}
            className="animate-fade-up rounded-xl border border-slate-700/70 bg-slate-900/70 p-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
              {c.label}
            </p>
            <p
              className={`mt-3 font-typewriter text-4xl text-amber-300 ${
                c.capitalize ? "capitalize" : ""
              }`}
            >
              {c.value}
            </p>
            <p className="mt-2 text-sm text-slate-400">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Link to={`/trend?${params.toString()}`} className={btnGhost}>
          Back
        </Link>
        <div className="flex gap-3">
          <Link to="/choose" className={btnGhost}>
            New case
          </Link>
          <Link to={`/compare?${params.toString()}`} className={btnPrimary}>
            Cross-check regions
          </Link>
        </div>
      </div>
    </div>
  );
}