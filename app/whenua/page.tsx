import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhenuaRecord = {
  id: string;
  title: string;
  block_name: string | null;
  location: string | null;
  legal_description: string | null;
  external_reference: string | null;
  historical_notes: string | null;
  status: string | null;
  sensitivity_level: string | null;
  created_at: string;
  updated_at: string | null;
};

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
      created_at,
      updated_at
    `
    )
    .order("created_at", { ascending: false });

  const whenuaRecords = (data ?? []) as WhenuaRecord[];

  return (
    <AppShell title="Whenua" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Whenua Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Whenua</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage whenua records, land block references, legal descriptions,
          historical notes, and sensitivity settings.
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
              Add the first whenua record to begin testing whenua record
              management.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Block Name</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Sensitivity</th>
                  <th className="px-4 py-3 font-medium">Status</th>
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
                        {record.title}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.block_name || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.location || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.sensitivity_level || "standard"}
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