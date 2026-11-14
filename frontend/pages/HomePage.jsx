import { useEffect, useState } from "react";
import { Link } from "react-router";
import { DEMO_URL } from "../data/siteConfig.js";
import { btnPrimary, btnGhost } from "../utils/ui.js";

function Typewriter({ text, speed = 45 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(t);
  }, [n, text, speed]);
  return (
    <span>
      {text.slice(0, n)}
      <span className="animate-blink text-amber-400">|</span>
    </span>
  );
}

function Radar() {
  const blips = [
    { name: "North Asia", top: "16%", left: "52%", delay: "0s" },
    { name: "South Asia", top: "46%", left: "30%", delay: "0.8s" },
    { name: "Sri Lanka", top: "70%", left: "58%", delay: "1.6s" },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem] animate-float">
      <div className="absolute inset-0 rounded-full border border-amber-400/40 bg-slate-900/60 shadow-[0_0_80px_rgba(251,191,36,0.12)]" />
      <div className="absolute inset-[12%] rounded-full border border-amber-400/25" />
      <div className="absolute inset-[26%] rounded-full border border-amber-400/25" />
      <div className="absolute inset-[40%] rounded-full border border-amber-400/25" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-amber-400/20" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-amber-400/20" />
      <div
        className="absolute inset-0 animate-sweep rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(251,191,36,0.45), rgba(251,191,36,0) 35%)",
        }}
      />
      {blips.map((b) => (
        <div
          key={b.name}
          className="absolute"
          style={{ top: b.top, left: b.left }}
        >
          <span
            className="absolute h-3 w-3 animate-ping rounded-full bg-cyan-300"
            style={{ animationDelay: b.delay }}
          />
          <span className="relative block h-3 w-3 rounded-full bg-cyan-300" />
          <span className="absolute left-5 top-[-4px] whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-cyan-200">
            {b.name}
          </span>
        </div>
      ))}
    </div>
  );
}

const FACTS = [
  { value: "3", label: "Suspect regions" },
  { value: "Monthly", label: "Evidence since 2000" },
  { value: "0.25°", label: "Grid resolution" },
  { value: "MK + Sen", label: "Statistical tests" },
];

const STEPS = [
  { title: "Open a case", text: "Pick a suspect region and a time window." },
  { title: "Examine evidence", text: "See the raw monthly temperature record." },
  { title: "Spot the pattern", text: "Annual means with a Sen's slope trend line." },
  { title: "Reach a verdict", text: "Mann-Kendall test: is the trend real or noise?" },
  { title: "Cross-check", text: "Compare all regions side by side." },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative grid items-center gap-10 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 px-6 py-14 lg:grid-cols-2 lg:px-14">
        <span className="absolute right-6 top-6 hidden animate-stamp rounded border-2 border-red-500/80 px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.3em] text-red-500/80 md:block">
          Case open
        </span>

        <div>
          <p
            className="animate-fade-up font-mono text-xs uppercase tracking-[0.35em] text-amber-400"
            style={{ animationDelay: "100ms" }}
          >
            NASA Space Apps Challenge 2026
          </p>
          <h1
            className="mt-4 animate-fade-up font-typewriter text-6xl text-slate-50 md:text-7xl"
            style={{ animationDelay: "250ms" }}
          >
            Climate Clue
          </h1>
          <p
            className="mt-6 min-h-[3.5rem] animate-fade-up font-typewriter text-xl text-amber-200 md:text-2xl"
            style={{ animationDelay: "450ms" }}
          >
            <Typewriter text="Something is changing in the air. Follow the evidence." />
          </p>
          <p
            className="mt-6 max-w-xl animate-fade-up leading-relaxed text-slate-400"
            style={{ animationDelay: "650ms" }}
          >
            Investigate temperature trends across Sri Lanka, South Asia and
            North Asia using NASA GLDAS data, the Mann-Kendall test and Sen's
            slope.
          </p>
          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "850ms" }}
          >
            <Link to="/choose" className={btnPrimary}>
              Open the case
            </Link>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className={btnGhost}
            >
              Watch demo
            </a>
          </div>
        </div>

        <div
          className="animate-fade-up"
          style={{ animationDelay: "500ms" }}
        >
          <Radar />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {FACTS.map((f, i) => (
          <div
            key={f.label}
            style={{ animationDelay: `${i * 120}ms` }}
            className="animate-fade-up rounded-xl border border-slate-700/70 bg-slate-900/70 p-6 text-center transition hover:-translate-y-1 hover:border-amber-400/60"
          >
            <p className="font-typewriter text-4xl text-amber-300">{f.value}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
              {f.label}
            </p>
          </div>
        ))}
      </section>

      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
          How the investigation works
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              style={{ animationDelay: `${i * 150}ms` }}
              className="animate-fade-up rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-amber-400/60"
            >
              <p className="font-typewriter text-3xl text-amber-400/80">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-slate-100">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}