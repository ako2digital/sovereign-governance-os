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

  description?: string | null;
  notes?: string | null;
  mandate?: string | null;

  status?: string | null;
  sensitivity_level?: string | null;
};

function getGovernanceTitle(record: GovernanceRecord) {
  return (
    record.title ||
    record.name ||
    record.governance_title ||
    "Untitled governance record"
  );
}

function getGovernanceType(record: GovernanceRecord) {
  return record.record_type || record.type || record.category || "Governance";
}

function getGovernanceDescription(record: GovernanceRecord) {
  return record.description || record.notes || record.mandate || null;
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

export default async function GovernancePage() {
  const { data, error } = await supabase
    .from("governance_records")
    .select("*")
    .order("created_at", { ascending: false });

  const governanceRecords = (data ?? []) as GovernanceRecord[];

  return (
    <AppShell title="Governance Records" eyebrow="Governance / Records">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Authority layer
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Governance records hold authority, roles, mandates, and structures.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-400">
            This module is for the records that explain how decisions are made:
            roles, groups, mandates, responsibilities, terms, structures,
            supporting notes, and governance context.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/governance/new"
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Governance Record
            </a>

            <a
              href="/decisions"
              className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View Decisions
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
                Total governance records
              </div>

              <div className="mt-3 text-4xl font-semibold text-white">
                {governanceRecords.length}
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
                Record type
              </div>

              <div className="mt-3 text-lg font-semibold text-stone-300">
                Authority and mandate record
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <section className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
          <p className="font-semibold text-red-300">
            Supabase error while loading governance records.
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
                Current Governance Records
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Live records from the Supabase governance_records table.
              </p>
            </div>

            <a
              href="/governance/new"
              className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Add record
            </a>
          </div>

          {governanceRecords.length === 0 ? (
            <div className="p-8">
              <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                <h3 className="text-xl font-semibold text-white">
                  No governance records yet.
                </h3>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Add the first governance record to begin proving the authority
                  and decision-making layer.
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
              {governanceRecords.map((record) => {
                const title = getGovernanceTitle(record);
                const type = getGovernanceType(record);
                const description = getGovernanceDescription(record);

                return (
                  <a
                    key={record.id}
                    href={`/governance/${record.id}`}
                    className="group grid gap-4 px-6 py-5 transition hover:bg-stone-900 xl:grid-cols-[1fr_180px_160px_120px]"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {title}
                      </h3>

                      <p className="mt-1 text-sm text-stone-500">{type}</p>

                      {description ? (
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500">
                          {description}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 font-mono text-[11px] uppercase ${statusClass(
                          record.status
                        )}`}
                      >
                        {record.status || "No status"}
                      </span>
                    </div>

                    <div className="text-sm text-stone-600">
                      Created {formatDate(record.created_at)}
                    </div>

                    <div className="text-sm font-semibold text-stone-500 transition group-hover:text-white xl:text-right">
                      View →
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
}