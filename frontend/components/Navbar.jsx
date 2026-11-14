import { NavLink } from "react-router";

const linkClass = ({ isActive }) =>
  `rounded-md px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
    isActive
      ? "bg-amber-400/10 text-amber-300"
      : "text-slate-400 hover:text-amber-200"
  }`;

export function MagnifierIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="10" cy="10" r="6" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-6 py-3 lg:px-10">
        <NavLink to="/" className="flex items-center gap-3 text-amber-400">
          <MagnifierIcon />
          <span className="font-typewriter text-xl tracking-wide text-slate-100">
            Climate Clue
          </span>
          <span className="hidden rounded border border-amber-400/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300 sm:inline">
            Case file
          </span>
        </NavLink>
        <div className="flex gap-1">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/choose" className={linkClass}>
            Open a case
          </NavLink>
        </div>
      </nav>
    </header>
  );
}