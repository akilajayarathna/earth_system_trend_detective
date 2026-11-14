export default function Panel({ label, children, className = "" }) {
  return (
    <section
      className={`relative rounded-xl border border-slate-700/70 bg-slate-900/70 p-6 backdrop-blur ${className}`}
    >
      <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-amber-400" />
      <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-amber-400" />
      <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-amber-400" />
      <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-amber-400" />
      {label && (
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400">
          {label}
        </p>
      )}
      {children}
    </section>
  );
}