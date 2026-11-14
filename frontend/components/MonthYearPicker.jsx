import { MIN_YEAR, MAX_YEAR } from "../data/siteConfig.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const YEARS = [];
for (let y = MIN_YEAR; y <= MAX_YEAR; y++) YEARS.push(y);

const selectClass =
  "rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none transition focus:border-amber-400";

export default function MonthYearPicker({ label, value, onChange }) {
  const [year, month] = value.split("-");

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
        {label}
      </span>
      <div className="flex gap-2">
        <select
          value={month}
          onChange={(e) => onChange(`${year}-${e.target.value}`)}
          className={selectClass}
        >
          {MONTHS.map((m, i) => {
            const v = String(i + 1).padStart(2, "0");
            return (
              <option key={v} value={v}>
                {m}
              </option>
            );
          })}
        </select>
        <select
          value={year}
          onChange={(e) => onChange(`${e.target.value}-${month}`)}
          className={selectClass}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}