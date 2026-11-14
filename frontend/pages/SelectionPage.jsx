import { useState } from "react";
import { useNavigate } from "react-router";
import SelectionCard from "../components/SelectionCard.jsx";
import MonthYearPicker from "../components/MonthYearPicker.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { Loading, ErrorBox } from "../components/Status.jsx";
import useApi from "../hooks/useApi.js";
import { getRegions } from "../api.js";
import { btnPrimary } from "../utils/ui.js";

export default function SelectionPage() {
  const navigate = useNavigate();
  const { data: regions, error, loading } = useApi(getRegions, []);
  const [region, setRegion] = useState("");
  const [start, setStart] = useState("2005-01");
  const [end, setEnd] = useState("2020-12");

  const rangeInvalid = start >= end;

  function handleSubmit(e) {
    e.preventDefault();
    if (!region || rangeInvalid) return;
    const params = new URLSearchParams({ region, start, end });
    navigate(`/raw-evidence?${params.toString()}`);
  }

  if (loading) return <Loading text="Pulling suspect files" />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Step 01 · The case"
        title="Choose your suspect"
        subtitle="Pick a region and the time window you want to investigate."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          {regions.map((r, i) => (
            <SelectionCard
              key={r.name}
              index={i}
              region={r}
              selected={region === r.name}
              onSelect={setRegion}
            />
          ))}
        </div>

        <Panel label="Investigation window">
          <div className="flex flex-wrap items-end gap-8">
            <MonthYearPicker label="From" value={start} onChange={setStart} />
            <MonthYearPicker label="To" value={end} onChange={setEnd} />
            <button
              type="submit"
              disabled={!region || rangeInvalid}
              className={btnPrimary}
            >
              Start investigation
            </button>
          </div>
          {rangeInvalid && (
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-red-400">
              Start must be earlier than end.
            </p>
          )}
          {!region && (
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-slate-500">
              Select a suspect region card first.
            </p>
          )}
        </Panel>
      </form>
    </div>
  );
}