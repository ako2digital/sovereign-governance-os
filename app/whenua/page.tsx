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
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Land record layer
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Whenua records hold land, evidence, and historical context.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-400">
            Each whenua record can store block names, location, legal
            descriptions, external references, historical notes, status, and
            sensitivity level.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/whenua/new"
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Whenua Record
            </a>

            <a
              href="/documents"
              className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View Documents
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-800 bg-stone-900/40 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Register status
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Total whenua records
              </div>

              <div className="mt-3 text-4xl font-semibold text-white">
                {whenuaRecords.length}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Database
              </div>

              <div className="mt-3 text-lg font-semibold text-green-400">
                Supabase connected
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Record fields
              </div>

              <div className="mt-3 text-lg font-semibold text-stone-300">
                Actual schema aligned
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <section className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
          <p className="font-semibold text-red-300">
            Supabase error while loading whenua records.
          </p>

          <p className="mt-3 text-sm leading-7 text-red-200/80">
            {error.message}
          </p>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60">
          <div className="flex items-center justify-between border-b border-stone-800 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Current Whenua Records
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Live records from the Supabase whenua_records table.
              </p>
            </div>

            <a
              href="/whenua/new"
              className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Add record
            </a>
          </div>

          {whenuaRecords.length === 0 ? (
            <div className="p-8">
              <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                <h3 className="text-xl font-semibold text-white">
                  No whenua records yet.
                </h3>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Add the first whenua record to begin proving the land register.
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
                  className="group grid gap-4 px-6 py-5 transition hover:bg-stone-900 xl:grid-cols-[1fr_180px_160px_120px]"
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

                  <div className="text-sm text-stone-600 xl:col-span-4">
                    Created {formatDate(record.created_at)}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
}