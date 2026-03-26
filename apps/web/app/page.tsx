import Link from "next/link";

const FEATURES = [
  {
    icon: "⛽",
    title: "Petroleum Fields",
    description:
      "Real boundary polygons for Johan Sverdrup, Ekofisk, Troll, Ormen Lange and more — sourced from Sodir.",
  },
  {
    icon: "🚁",
    title: "Helicopter Traffic",
    description:
      "Live helicopter positions with trajectory tracking, serving offshore installations across the NCS.",
  },
  {
    icon: "🚢",
    title: "Vessel Traffic",
    description:
      "AIS vessel data from Barentswatch showing all ship movements in the North Sea in real time.",
  },
  {
    icon: "🌊",
    title: "Weather & Waves",
    description:
      "Current wind conditions and wave heights from the Met API, overlaid directly on the map.",
  },
];

const STATS = [
  { value: "5+", label: "Petroleum fields" },
  { value: "24/7", label: "Live tracking" },
  { value: "6h", label: "Trajectory history" },
  { value: "30s", label: "Refresh interval" },
];

export default function LandingPage() {
  return (
    <div className="min-h-full bg-slate-950 text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-9 rounded-full bg-cyan-500/15 border border-cyan-500/40">
            <span className="text-xs font-extrabold tracking-wider text-cyan-400">NCS</span>
          </div>
          <span className="font-semibold tracking-wide text-sm">Traffic</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/datasources"
            className="text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
          >
            Data Sources
          </Link>
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Open Map
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-28">
        {/* Gradient orb background */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(6,182,212,0.35) 0%, rgba(6,182,212,0) 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-6">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white/60">Live data from the North Sea</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Monitor the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Norwegian Continental Shelf
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Real-time visualization of petroleum fields, helicopter traffic, vessel movements, and
            weather conditions — all on one interactive map.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
            >
              Launch Map
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </Link>
            <Link
              href="/datasources"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              View Data Sources
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 px-6 py-10">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-cyan-400">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-white/40 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Everything you need to monitor the NCS
          </h2>
          <p className="mt-4 text-white/40 max-w-lg mx-auto">
            Data from multiple authoritative sources, combined into a single real-time interface.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm text-white/40 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/5">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0) 70%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-24">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to explore?
          </h2>
          <p className="mt-4 text-white/40">
            Jump into the live map and see what&apos;s happening on the Norwegian Continental Shelf right
            now.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 mt-8 rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
          >
            Open the Map
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-7 rounded-full bg-cyan-500/15 border border-cyan-500/30">
              <span className="text-[9px] font-extrabold tracking-wider text-cyan-400">NCS</span>
            </div>
            <span className="text-xs font-semibold text-white/60">Traffic</span>
          </div>
          <p className="text-xs text-white/25">
            Data sourced from Sodir, Flightradar24, Barentswatch, and MET Norway.
          </p>
        </div>
      </footer>
    </div>
  );
}
