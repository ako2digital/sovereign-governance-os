import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeRecord = {
  id: string;
  created_at?: string | null;
  name?: string | null;
  title?: string | null;
  marae_name?: string | null;
  location?: string | null;
  rohe?: string | null;
  address?: string | null;
  hapu?: string | null;
  hapū?: string | null;
  iwi?: string | null;
  description?: string | null;
  notes?: string | null;
  historical_notes?: string | null;
  status?: string | null;
  sensitivity_level?: string | null;
};

const relatedRecordLinks = [
  {
    label: "Whenua",
    href: "/whenua",
    description: "Land records connected to marae, whenua, and place.",
  },
  {
    label: "Hui",
    href: "/hui",
    description: "Future hui records hosted at or connected to marae.",
  },
  {
    label: "Governance",
    href: "/governance",
    description: "Mandates, authority, roles, and governance records.",
  },
  {
    label: "Documents",
    href: "/documents",
    description: "Photos, records, maps, minutes, and supporting files.",
  },
];

function getMaraeName(record: MaraeRecord) {
  return record.name || record.marae_name || record.title || "Untitled marae record";
}

function getLocation(record: MaraeRecord) {
  return record.location || record.rohe || record.address || "Location not recorded";
}

function getAffiliation(record: MaraeRecord) {
  return record.hapu || record.hapū || record.iwi || "Affiliation not recorded";
}

function getDescription(record: MaraeRecord) {
  return (
    record.description ||
    record.notes ||
    record.historical_notes ||
    "No description recorded."
  );
}

function formatDate(date?: string | null) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status?: string | null) {
  if (status === "active") {
    return "bg-green-400/10 text-green-400";
  }

  if (status === "under_review") {
    return "bg-stone-100 text-stone-950";
  }

  if (status === "archived") {
    return "bg-stone-800 text-stone-500";
  }

  return "bg-stone-800 text-stone-500";
}

export default async function MaraePage() {
  const { data, error } = await supabase
    .from("marae_records")
    .select("*")
    .order("created_at", { ascending: false });

  const maraeRecords = (data ?? []) as MaraeRecord[];

  return (
    <AppShell title="Marae Records" eyebrow="Governance / Marae">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <a
                href="/marae"
                className="inline-flex rounded-full border border-stone-700 bg-stone-950 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-stone-400 transition hover:border-stone-500 hover:text-white"
              >
                Marae register
              </a>

              <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Marae records connected to people, whenua, hui, and governance.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                Marae records are community anchors. Each record should later
                connect to whenua, hui, governance structures, documents,
                decisions, tasks, and activity history.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/marae/new"
                className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add Marae
              </a>

              <a
                href="/hui"
                className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                View Hui
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60">
            <div className="flex items-center justify-between border-b border-stone-800 px-6 py-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Current records
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {maraeRecords.length} marae records
                </h2>
              </div>

              <a
                href="/marae/new"
                className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Add record
              </a>
            </div>

            {error ? (
              <div className="p-6">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="font-semibold text-red-300">
                    Supabase error while loading marae records.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-red-200/80">
                    {error.message}
                  </p>
                </div>
              </div>
            ) : maraeRecords.length === 0 ? (
              <div className="p-6">
                <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                  <h3 className="text-xl font-semibold text-white">
                    No marae records yet.
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    Add the first marae record to begin the community record layer.
                  </p>

                  <a
                    href="/marae/new"
                    className="mt-6 inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                  >
                    Add First Marae Record
                  </a>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone-800">
                {maraeRecords.map((record) => (
                  <a
                    key={record.id}
                    href={`/marae/${record.id}`}
                    className="group grid gap-4 px-6 py-5 transition hover:bg-stone-900 xl:grid-cols-[1fr_180px_150px_120px]"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {getMaraeName(record)}
                      </h3>

                      <p className="mt-1 text-sm text-stone-500">
                        {getLocation(record)}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
                        {getDescription(record)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-stone-300">
                        {getAffiliation(record)}
                      </p>

                      <p className="mt-2 text-xs text-stone-600">
                        Created {formatDate(record.created_at)}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 font-mono text-[11px] uppercase ${statusClass(
                          record.status
                        )}`}
                      >
                        {record.status || "not set"}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-stone-500 transition group-hover:text-white xl:text-right">
                      View →
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          <aside className="grid gap-6 content-start">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Register status
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Total records
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-white">
                    {maraeRecords.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Database
                  </p>

                  <p className="mt-3 text-sm font-semibold text-green-400">
                    Supabase connected
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Display
                  </p>

                  <p className="mt-3 text-sm font-semibold text-stone-300">
                    Flexible field mapping
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Related records
              </p>

              <div className="mt-5 grid gap-3">
                {relatedRecordLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-2xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
                  >
                    <p className="text-sm font-semibold text-white">
                      {link.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      {link.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}