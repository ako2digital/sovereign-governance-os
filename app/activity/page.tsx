import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type ActivityLogRecord = {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string | null;
  created_at: string;
  actor: {
    full_name: string;
  } | null;
};

export default async function ActivityPage() {
  const { data, error } = await supabase
    .from("activity_log")
    .select(
      `
      id,
      action,
      entity_type,
      entity_id,
      description,
      created_at,
      actor:actor_id (
        full_name
      )
    `
    )
    .order("created_at", { ascending: false });

  const activityRecords = (data ?? []) as unknown as ActivityLogRecord[];

  return (
    <AppShell title="Activity" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Activity Log
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Activity</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Track system activity, record changes, preserve accountability, and
          create a visible history of actions across the platform.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Activity Register
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase activity_log table.
            </p>
          </div>

          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            {activityRecords.length} records
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : activityRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No activity records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Activity records will appear here once system actions are logged.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Entity Type</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>

              <tbody>
                {activityRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4 text-stone-100">
                      {record.action}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.entity_type || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.actor?.full_name || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.description || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.created_at}
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