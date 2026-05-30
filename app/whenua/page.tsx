import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhenuaRecord = {
  id: string;
  title: string | null;
  block_name: string | null;
  location: string | null;
  legal_description: string | null;
  external_reference: string | null;
  historical_notes: string | null;
  status: string | null;
  sensitivity_level: string | null;
  created_at: string | null;
};

const relatedRecordLinks = [
  {
    label: "Documents",
    href: "/documents",
    description: "Evidence, maps, legal records, and supporting files.",
  },
  {
    label: "Governance",
    href: "/governance",
    description: "Mandates, authority, decisions, and governance context.",
  },
  {
    label: "Marae",
    href: "/marae",
    description: "Future marae links connected to whenua records.",
  },
  {
    label: "Activity",
    href: "/activity",
    description: "Future audit trail for whenua record changes.",
  },
];

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

function formatValue(value?: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return value;
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

function sensitivityClass(level?: string | null) {
  if (level === "restricted") {
    return "bg-red-400/10 text-red-300";
  }

  if (level === "sensitive") {
    return "bg-yellow-400/10 text-yellow-300";
  }

  return "bg-stone-800 text-stone-400";
}

export default async function WhenuaPage() {
  const { data, error } = await supabase
    .from("whenua_records")
    .select(
      `
      id,
      title,
      block_name,
      location,
      legal_description,
      external_reference,
      historical_notes,
      status,
      sensitivity_level,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  const whenuaRecords = (data ?? []) as WhenuaRecord[];

  return (
    <AppShell title="Whenua Records" eyebrow="Core Records / Whenua">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <a
                href="/whenua"
                className="inline-flex rounded-full border border-stone-700 bg-stone-950 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-stone-400 transition hover:border-stone-500 hover:text-white"
              >
                Whenua register
              </a>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Land records connected to evidence, history, and authority.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                Whenua records hold title, block name, location, legal
                description, external reference, historical notes, status, and
                sensitivity level.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/whenua/new"
                className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add Whenua
              </a>

              <a
                href="/documents"
                className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                View Documents
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
                  {whenuaRecords.length} whenua records
                </h2>
              </div>

              <a
                href="/whenua/new"
                className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Add record
              </a>
            </div>

            {error ? (
              <div className="p-6">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="font-semibold text-red-300">
                    Supabase error while loading whenua records.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-red-200/80">
                    {error.message}
                  </p>
                </div>
              </div>
            ) : whenuaRecords.length === 0 ? (
              <div className="p-6">
                <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                  <h3 className="text-xl font-semibold text-white">
                    No whenua records yet.
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    Add the first whenua record to begin the land record layer.
                  </p>

                  <a
                    href="/whenua/new"
                    className="mt-6 inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                  >
                    Add First Whenua Record
                  </a>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone-800">
                {whenuaRecords.map((record) => (
                  <a
                    key={record.id}
                    href={`/whenua/${record.id}`}
                    className="group grid gap-4 px-6 py-5 transition hover:bg-stone-900 xl:grid-cols-[1fr_170px_170px_120px]"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {record.title || "Untitled whenua record"}
                      </h3>

                      <p className="mt-1 text-sm text-stone-500">
                        {formatValue(record.block_name)}
                        {record.location ? ` · ${record.location}` : ""}
                      </p>

                      {record.external_reference ? (
                        <p className="mt-2 font-mono text-xs text-stone-600">
                          Ref: {record.external_reference}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 font-mono text-[11px] uppercase ${statusClass(
                          record.status
                        )}`}
                      >
                        {formatValue(record.status)}
                      </span>

                      <p className="mt-3 text-xs text-stone-600">
                        {formatDate(record.created_at)}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 font-mono text-[11px] uppercase ${sensitivityClass(
                          record.sensitivity_level
                        )}`}
                      >
                        {formatValue(record.sensitivity_level)}
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

          <aside className="grid gap-6">
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
                    {whenuaRecords.length}
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
                    Schema
                  </p>

                  <p className="mt-3 text-sm font-semibold text-stone-300">
                    Actual fields aligned
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