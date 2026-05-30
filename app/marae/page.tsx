import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeRecord = {
  id: string;
  name: string;
  location: string | null;
  hapu_affiliation: string | null;
  iwi_affiliation: string | null;
  governance_notes: string | null;
  contact_notes: string | null;
  status: string | null;
  created_at: string;
};

export default async function MaraePage() {
  const { data, error } = await supabase
    .from("marae_records")
    .select(
      "id, name, location, hapu_affiliation, iwi_affiliation, governance_notes, contact_notes, status, created_at"
    )
    .order("created_at", { ascending: false });

  const maraeRecords = (data ?? []) as MaraeRecord[];

  return (
    <AppShell title="Marae" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Marae Records
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Marae</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Store marae records, governance notes, documents, hui, minutes,
          decisions, pānui, and tasks.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Marae Register
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase marae_records table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {maraeRecords.length} records
            </div>

            <a
              href="/marae/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Marae
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : maraeRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No marae records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first marae record to begin testing marae record
              management.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Hapū</th>
                  <th className="px-4 py-3 font-medium">Iwi</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {maraeRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4 text-stone-100">
                      {record.name}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.location || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.hapu_affiliation || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.iwi_affiliation || "—"}
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