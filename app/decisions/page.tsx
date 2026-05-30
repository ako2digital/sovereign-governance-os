import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type DecisionRecord = {
  id: string;
  title: string;
  decision_text: string | null;
  decision_date: string | null;
  created_at: string;
  hui: {
    title: string;
  } | null;
  minutes: {
    title: string;
  } | null;
};

export default async function DecisionsPage() {
  const { data, error } = await supabase
    .from("decisions")
    .select(
      `
      id,
      title,
      decision_text,
      decision_date,
      created_at,
      hui:hui_id (
        title
      ),
      minutes:minutes_id (
        title
      )
    `
    )
    .order("created_at", { ascending: false });

  const decisionRecords = (data ?? []) as unknown as DecisionRecord[];

  return (
    <AppShell title="Decisions" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Decision Records
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Decisions</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Record formal decisions made through hui, connect them to minutes,
          and preserve clear evidence of what was agreed.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Decisions Register
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase decisions table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {decisionRecords.length} records
            </div>

            <a
              href="/decisions/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Decision
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : decisionRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No decision records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first decision record to begin testing decision tracking.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Hui</th>
                  <th className="px-4 py-3 font-medium">Minutes</th>
                  <th className="px-4 py-3 font-medium">Decision Date</th>
                  <th className="px-4 py-3 font-medium">Decision Text</th>
                </tr>
              </thead>

              <tbody>
                {decisionRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4">
                      <a
                        href={`/decisions/${record.id}`}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.title}
                      </a>
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {record.hui?.title || "—"}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {record.minutes?.title || "—"}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {record.decision_date || "—"}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {record.decision_text || "—"}
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