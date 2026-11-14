import { Link } from "react-router";
import { btnGhost } from "../utils/ui.js";

export function Loading({ text = "Analysing evidence" }) {
  return (
    <div className="flex items-center gap-3 py-16 font-mono text-sm uppercase tracking-widest text-amber-300">
      <span className="h-3 w-3 animate-ping rounded-full bg-amber-400" />
      {text}...
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-5 text-red-200">
        <p className="font-mono text-xs uppercase tracking-widest text-red-400">
          Investigation blocked
        </p>
        <p className="mt-2">{message}</p>
      </div>
      <Link to="/choose" className={btnGhost}>
        Back to case selection
      </Link>
    </div>
  );
}