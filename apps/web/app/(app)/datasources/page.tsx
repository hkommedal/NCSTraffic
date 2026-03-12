import { getRegistry } from "@/lib/datasource-registry";

export const dynamic = "force-dynamic";

type StaticSource = {
  key: string;
  name: string;
  description: string;
  url: string;
};

const STATIC_SOURCES: StaticSource[] = [
  {
    key: "sodir-fields",
    name: "Sodir — Field Polygons",
    description: "Norwegian petroleum field boundary polygons from the Norwegian Offshore Directorate (Sokkeldirektoratet)",
    url: "https://sodir.no",
  },
  {
    key: "sodir-facilities",
    name: "Sodir — Facilities",
    description: "Offshore installation and facility positions from the Norwegian Offshore Directorate",
    url: "https://sodir.no",
  },
  {
    key: "airports",
    name: "Airport / Heliport data",
    description: "Key airports and heliports serving the NCS, used to draw helicopter route lines",
    url: "https://ourairports.com",
  },
];

function formatRelative(date: Date | null): string {
  if (!date) return "Not yet fetched";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

function StatusBadge({ error, fetched }: { error: string | null; fetched: Date | null }) {
  if (!fetched) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/8 dark:text-white/40">
        <span className="size-1.5 rounded-full bg-slate-400" />
        Pending
      </span>
    );
  }
  if (error) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <span className="size-1.5 rounded-full bg-red-500" />
        Error
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      OK
    </span>
  );
}

export default function DatasourcesPage() {
  const registry = getRegistry();

  const liveSources = Object.entries(registry).map(([key, info]) => ({
    key,
    name: info.name,
    description: info.description,
    url: info.url,
    lastFetchedAt: info.lastFetchedAt,
    error: info.error,
  }));

  return (
    <main className="min-h-screen pl-56 bg-slate-50 dark:bg-[#0f1117]">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Data Sources
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/45">
            External services and static datasets powering the NCS Traffic map.
          </p>
        </div>

        {/* Live sources */}
        <section className="mb-10">
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30">
            Live API Sources
          </h2>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden divide-y divide-slate-200 dark:divide-white/8">
            {liveSources.map((src) => (
              <div key={src.key} className="bg-white dark:bg-white/[0.03] px-5 py-4 flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{src.name}</span>
                    <StatusBadge error={src.error} fetched={src.lastFetchedAt} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed">{src.description}</p>
                  {src.error && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-mono">{src.error}</p>
                  )}
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-[11px] text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 font-mono"
                  >
                    {src.url}
                  </a>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wide mb-0.5">
                    Last fetched
                  </p>
                  <p className="text-xs text-slate-600 dark:text-white/60 tabular-nums">
                    {formatRelative(src.lastFetchedAt)}
                  </p>
                  {src.lastFetchedAt && (
                    <p className="text-[10px] text-slate-400 dark:text-white/25 tabular-nums">
                      {src.lastFetchedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Static sources */}
        <section>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30">
            Static / Built-in Data
          </h2>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden divide-y divide-slate-200 dark:divide-white/8">
            {STATIC_SOURCES.map((src) => (
              <div key={src.key} className="bg-white dark:bg-white/[0.03] px-5 py-4 flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{src.name}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <span className="size-1.5 rounded-full bg-blue-400" />
                      Static
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed">{src.description}</p>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-[11px] text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 font-mono"
                  >
                    {src.url}
                  </a>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wide mb-0.5">
                    Last fetched
                  </p>
                  <p className="text-xs text-slate-500 dark:text-white/40">Bundled at build time</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
