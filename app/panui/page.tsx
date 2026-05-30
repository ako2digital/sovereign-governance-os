import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PanuiRecord = {
  id: string;
  title: string;
  message: string | null;
  panui_type: string | null;
  published_date: string | null;
  status: string | null;
  created_at: string;
  related_marae: {
    name: string;
  } | null;
  related_whenua: {
    title: string;
  } | null;
  related_hui: {
    title: string;
  } | null;
};

export default async function PanuiPage() {
  const { data, error } = await supabase
    .from("panui")
    .select(
      `
      id,
      title,
      message,
      panui_type,
      published_date,
      status,
      created_at,
      related_marae:related_marae_id (
        name
      ),
      related_whenua:related_whenua_id (
        title
      ),
      related_hui:related_hui_id (
        title
      )
    `
    )
    .order("created_at", { ascending: false });

  const panuiRecords = (data ?? []) as unknown as PanuiRecord[];

  return (
    <AppShell title="Pānui" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Pānui Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Pānui</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create and manage communications connected to marae, whenua, hui, and
          hapū activity.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Pānui Register
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase panui table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {panuiRecords.length} records
            </div>

            <a
              href="/panui/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Pānui
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : panuiRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No pānui records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first pānui record to begin testing communications.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Related To</th>
                  <th className="px-4 py-3 font-medium">Published</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                </tr>
              </thead>

              <tbody>
                {panuiRecords.map((record) => {
                  const relatedTo =
                    record.related_marae?.name ||
                    record.related_whenua?.title ||
                    record.related_hui?.title ||
                    "—";

                  return (
                    <tr
                      key={record.id}
                      className="border-t border-stone-800 bg-stone-900"
                    >
                      <td className="px-4 py-4 text-stone-100">
                        {record.title}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {record.panui_type || "—"}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {relatedTo}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {record.published_date || "—"}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {record.status || "draft"}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {record.message || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}