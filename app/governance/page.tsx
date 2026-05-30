import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type GovernanceRecord = {
  id: string;
  created_at?: string | null;
  title?: string | null;
  name?: string | null;
  governance_title?: string | null;
  record_type?: string | null;
  type?: string | null;
  category?: string | null;
  summary?: string | null;
  description?: string | null;
  notes?: string | null;
  mandate?: string | null;
  status?: string | null;
  effective_date?: string | null;
  sensitivity_level?: string | null;
  related_marae_id?: string | null;
  related_whenua_id?: string | null;
};

const relatedRecordLinks = [
  {
    label: "Marae",
    href: "/marae",
    description: "Community anchors connected to governance records.",
  },
  {
    label: "Whenua",
    href: "/whenua",
    description: "Land records connected to mandates, policy, and authority.",
  },
  {
    label: "Hui",
    href: "/hui",
    description: "Future hui records that produce or review governance records.",
  },
  {
    label: "Decisions",
    href: "/decisions",
    description: "Future decisions created from governance records.",
  },
];

function getTitle(record: GovernanceRecord) {
  return (
    record.title ||
    record.governance_title ||
    record.name ||
    "Untitled governance record"
  );
}

function getType(record: GovernanceRecord) {
  return record.record_type || record.type || record.category || "Governance";
}

function getSummary(record: GovernanceRecord) {
  return (
    record.summary ||
    record.description ||
    record.mandate ||
    record.notes ||
    "No summary recorded."
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

  if (status === "draft") {
    return "bg-stone-100 text-stone-950";
  }

  if (status === "under_review") {
    return "bg-yellow-400/10 text-yellow-300";
  }

  if (status === "archived") {
    return "bg-stone-800 text-stone-500";
  }

  return "bg-stone-800 text-stone-500";
}

function relationStatus(record: GovernanceRecord) {
  const count = [record.related_marae_id, record.related_whenua_id].filter(
    Boolean
  ).length;

  if (count === 0) {
    return "No direct links";
  }

  if (count === 1) {
    return "1 direct link";
  }

  return `${count} direct links`;
}

export default async function GovernancePage() {
  const { data, error } = await supabase
    .from("governance_records")
    .select("*")
    .order("created_at", { ascending: false });

  const governanceRecords = (data ?? []) as GovernanceRecord[];

  return (
    <AppShell title="Governance Records" eyebrow="Governance / Records">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <a
                href="/governance"
                className="inline-flex rounded-full border border-stone-700 bg-stone-950 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-stone-400 transition hover:border-stone-500 hover:text-white"
              >
                Governance register
              </a>

              <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Governance records for mandates, policy, authority, and decisions.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                Governance records hold the structure behind authority. They
                should connect to marae, whenua, hui, minutes, decisions,
                documents, tasks, and activity history.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/governance/new"
                className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add Governance
              </a>

              <a
                href="/decisions"
                className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                View Decisions
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
                  {governanceRecords.length} governance records
                </h2>
              </div>

              <a
                href="/governance/new"
                className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Add record
              </a>
            </div>

            {error ? (
              <div className="p-6">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="font-semibold text-red-300">
                    Supabase error while loading governance records.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-red-200/80">
                    {error.message}
                  </p>
                </div>
              </div>
            ) : governanceRecords.length === 0 ? (
              <div className="p-6">
                <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                  <h3 className="text-xl font-semibold text-white">
                    No governance records yet.
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    Add the first governance record to begin the authority layer.
                  </p>

                  <a
                    href="/governance/new"
                    className="mt-6 inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                  >
                    Add First Governance Record
                  </a>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone-800">
                {governanceRecords.map((record) => (
                  <a
                    key={record.id}
                    href={`/governance/${record.id}`}
                    className="group grid gap-4 px-6 py-5 transition hover:bg-stone-900 xl:grid-cols-[1fr_170px_150px_120px]"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {getTitle(record)}
                      </h3>

                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                        {getType(record)}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
                        {getSummary(record)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-stone-300">
                        {relationStatus(record)}
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

                      {record.effective_date ? (
                        <p className="mt-3 text-xs text-stone-600">
                          Effective {formatDate(record.effective_date)}
                        </p>
                      ) : null}
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
                    {governanceRecords.length}
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

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Record flow
              </p>

              <p className="mt-5 text-sm leading-7 text-stone-400">
                Governance records should be treated as authority anchors. The
                next layer is to connect each record directly to hui, minutes,
                decisions, documents, tasks, and activity logs.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}