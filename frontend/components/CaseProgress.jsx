import { useLocation } from "react-router";

const STEPS = [
  { path: "/choose", label: "Case" },
  { path: "/raw-evidence", label: "Evidence" },
  { path: "/trend", label: "Pattern" },
  { path: "/verdict", label: "Verdict" },
  { path: "/compare", label: "Cross-check" },
];

export default function CaseProgress() {
  const { pathname } = useLocation();
  const current = STEPS.findIndex((s) => s.path === pathname);
  if (current === -1) return null;

  return (
    <ol className="mb-8 flex items-center gap-2 overflow-x-auto font-mono text-[11px] uppercase tracking-widest">
      {STEPS.map((s, i) => (
        <li key={s.path} className="flex items-center gap-2">
          <span
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
              i === current
                ? "border-amber-400 bg-amber-400/10 text-amber-300"
                : i < current
                ? "border-slate-600 text-slate-300"
                : "border-slate-800 text-slate-600"
            }`}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span>{s.label}</span>
          </span>
          {i < STEPS.length - 1 && (
            <span className="h-px w-6 bg-slate-700 sm:w-10" />
          )}
        </li>
      ))}
    </ol>
  );
}