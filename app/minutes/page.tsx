import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MinutesRecord = {
  id: string;
  title: string;
  summary: string | null;
  full_minutes: string | null;
  recorded_by: string | null;
  approved_status: string | null;
  approved_date: string | null;
  created_at: string;
  hui: {
    title: string;
  } | null;
};

export default async function MinutesPage() {
  const { data, error } = await supabase
    .from("minutes")
    .select(
      `
      id,
      title,
      summary,
      full_minutes,
      recorded_by,
      approved_status,
      approved_date,
      created_at,
      hui:hui_id (
        title
      )
    `
    )
    .order("created_at", { ascending: false });

  const minutesRecords = (data ?? []) as unknown as MinutesRecord[];

  return (
    <AppShell title="Minutes" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Hui Minutes
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Minutes</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Preserve what happened during hui, what was discussed, what was
          decided, and what followed.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Minutes Register
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase minutes table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {minutesRecords.length} records
            </div>

            <a
              href="/minutes/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Minutes
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : minutesRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No minutes records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first minutes record to begin testing hui documentation.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Hui</th>
                  <th className="px-4 py-3 font-medium">Recorded by</th>
                  <th className="px-4 py-3 font-medium">Approval</th>
                  <th className="px-4 py-3 font-medium">Approved date</th>
                </tr>
              </thead>

              <tbody>
                {minutesRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4 text-stone-100">
                      {record.title}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.hui?.title || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.recorded_by || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.approved_status || "draft"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.approved_date || "—"}
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