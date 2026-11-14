import { REGION_INFO } from "../data/regionInfo.js";

export default function SelectionCard({ region, index, selected, onSelect }) {
  const info = REGION_INFO[region.name] || {
    image: "",
    countries: [],
    description: "",
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(region.name)}
      style={{ animationDelay: `${index * 120}ms` }}
      className={`group relative flex animate-fade-up flex-col overflow-hidden rounded-2xl border bg-slate-900 text-left transition duration-300 hover:-translate-y-1 ${
        selected
          ? "border-amber-400 shadow-[0_0_0_1px_rgba(251,191,36,0.6),0_0_45px_rgba(251,191,36,0.18)]"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      <div className="relative h-52 w-full overflow-hidden bg-slate-800">
        {info.image && (
          <img
            src={info.image}
            alt={region.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        <span className="absolute left-4 top-4 rounded bg-slate-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
          Suspect region {String(index + 1).padStart(2, "0")}
        </span>
        {selected && (
          <span className="absolute right-4 top-4 animate-stamp rounded border-2 border-amber-400 px-2 py-1 font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
            Selected
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="font-typewriter text-2xl text-slate-50">{region.name}</h3>
        <p className="text-sm leading-relaxed text-slate-400">
          {info.description}
        </p>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            Countries covered
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {info.countries.map((c) => (
              <li
                key={c}
                className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-auto font-mono text-[11px] text-slate-500">
          LAT {region.south} to {region.north} · LON {region.west} to{" "}
          {region.east}
        </p>
      </div>
    </button>
  );
}