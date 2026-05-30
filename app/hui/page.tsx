import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type HuiRecord = {
  id: string;
  title: string;
  hui_date: string | null;
  location: string | null;
  purpose: string | null;
  agenda: string | null;
  status: string | null;
  created_at: string;
  related_marae: {
    name: string;
  } | null;
  related_whenua: {
    title: string;
  } | null;
  related_governance_record: {
    title: string;
  } | null;
};

export default async function HuiPage() {
  const { data, error } = await supabase
    .from("hui")
    .select(
      `
      id,
      title,
      hui_date,
      location,
      purpose,
      agenda,
      status,
      created_at,
      related_marae:related_marae_id (
        name
      ),
      related_whenua:related_whenua_id (
        title
      ),
      related_governance_record:related_governance_record_id (
        title
      )
    `
    )
    .order("created_at", { ascending: false });

  const huiRecords = (data ?? []) as unknown as HuiRecord[];

  return (
    <AppShell title="Hui" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Hui Records
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Hui</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create hui records connected to marae, whenua, governance records,
          agendas, minutes, decisions, documents, and tasks.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Hui Register</h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase hui table.
            </p>
          </div>

          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            {huiRecords.length} records
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : huiRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No hui records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first hui record in Supabase to begin testing hui record
              management.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Related Marae</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {huiRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4 text-stone-100">
                      {record.title}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.hui_date || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.location || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.related_marae?.name || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.status || "planned"}
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