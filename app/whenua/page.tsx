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

function formatValue(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value;
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
    <AppShell title="Whenua" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Whenua Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Whenua</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage land records, block names, locations, legal descriptions,
          historical notes, external references, status, and sensitivity levels.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Whenua Register
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase whenua_records table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {whenuaRecords.length} records
            </div>

            <a
              href="/whenua/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Whenua
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : whenuaRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No whenua records yet
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add the first whenua record to begin building the land record
              layer.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Block</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">External Ref</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sensitivity</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {whenuaRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4">
                      <a
                        href={`/whenua/${record.id}`}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.title || "Untitled whenua record"}
                      </a>

                      <p className="mt-1">
                        <a
                          href={`/whenua/${record.id}`}
                          className="font-mono text-xs text-stone-600 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {record.id}
                        </a>
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      {record.block_name ? (
                        <a
                          href={`/whenua/${record.id}`}
                          className="font-medium text-stone-300 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {record.block_name}
                        </a>
                      ) : (
                        <span className="text-stone-500">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.location)}
                    </td>

                    <td className="px-4 py-4">
                      {record.external_reference ? (
                        <a
                          href={`/whenua/${record.id}`}
                          className="font-medium text-stone-300 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {record.external_reference}
                        </a>
                      ) : (
                        <span className="text-stone-500">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.sensitivity_level)}
                    </td>

                    <td className="px-4 py-4">
                      <a
                        href={`/whenua/${record.id}`}
                        className="text-sm font-medium text-stone-300 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        View record
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Related Records
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Useful pathways connected to whenua records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/whenua/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Whenua
            </a>

            <a
              href="/documents"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View Documents
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <a
            href="/whenua/new"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Add Whenua</h3>

            <p className="mt-1 text-sm text-stone-400">
              Create a new land record.
            </p>
          </a>

          <a
            href="/documents"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Documents</h3>

            <p className="mt-1 text-sm text-stone-400">
              Evidence, maps, legal records, letters, and supporting files.
            </p>
          </a>

          <a
            href="/governance"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Governance</h3>

            <p className="mt-1 text-sm text-stone-400">
              Mandates, authority, decisions, and governance context.
            </p>
          </a>

          <a
            href="/marae"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Marae</h3>

            <p className="mt-1 text-sm text-stone-400">
              Marae records that may connect to whenua.
            </p>
          </a>

          <a
            href="/hui"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Hui</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future hui records connected to whenua kaupapa.
            </p>
          </a>

          <a
            href="/decisions"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Decisions</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future decisions created from whenua-related work.
            </p>
          </a>

          <a
            href="/tasks"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Tasks</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future follow-up actions for whenua matters.
            </p>
          </a>

          <a
            href="/activity"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Activity</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future record history and audit trail.
            </p>
          </a>
        </div>
      </section>
    </AppShell>
  );
}