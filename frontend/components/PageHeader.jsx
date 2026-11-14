export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="mb-8 animate-fade-up">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-typewriter text-4xl text-slate-50 md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 border-l-2 border-amber-400/60 pl-3 text-lg text-slate-300">
          {subtitle}
        </p>
      )}
    </header>
  );
}