import { Outlet } from "react-router";
import Navbar from "../components/Navbar.jsx";
import CaseProgress from "../components/CaseProgress.jsx";

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.10),transparent_55%)]" />
      <div className="pointer-events-none fixed -left-32 top-1/3 h-96 w-96 animate-drift rounded-full bg-cyan-500/10 blur-3xl" />
      <Navbar />
      <main className="relative mx-auto w-full max-w-[1500px] flex-1 px-6 py-8 lg:px-10">
        <CaseProgress />
        <Outlet />
      </main>
      <footer className="relative border-t border-slate-800 px-6 py-5 text-center font-mono text-xs uppercase tracking-widest text-slate-500">
        Source: NASA GLDAS Noah L4 monthly 0.25 degree V2.1 (GES DISC)
      </footer>
    </div>
  );
}