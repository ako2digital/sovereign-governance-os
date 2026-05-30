import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type GovernanceRecord = {
  id: string;
  title: string;
  record_type: string | null;
  summary: string | null;
  status: string | null;
  effective_date: string | null;
  created_at: string;
  related_marae: {
    name: string;
  } | null;
  related_whenua: {
    title: string;
  } | null;
};

export default async function GovernancePage() {
  const { data, error } = await supabase
    .from("governance_records")
    .select(
      `
      id,
      title,
      record_type,
      summary,
      status,
      effective_date,
      created_at,
      related_marae:related_marae_id (
        name
      ),
      related_whenua:related_whenua_id (
        title
      )
    `
    )
    .order("created_at", { ascending: false });

  const governanceRecords = (data ?? []) as unknown as GovernanceRecord[];

  return (
    <AppShell title="Governance" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Governance Records
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Governance</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Track governance records, mandates, policies, resolutions, authority,
          related marae, related whenua, and supporting summaries.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Governance Register
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase governance_records table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {governanceRecords.length} records
            </div>

            <a
              href="/governance/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Governance
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : governanceRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No governance records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first governance record to begin testing governance record
              management.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Related Marae</th>
                  <th className="px-4 py-3 font-medium">Related Whenua</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {governanceRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4 text-stone-100">
                      {record.title}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.record_type || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.related_marae?.name || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.related_whenua?.title || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.status || "active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
