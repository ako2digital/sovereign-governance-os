import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type ActivityRecord = {
  id: string;
  action?: string | null;
  event_type?: string | null;
  module?: string | null;
  table_name?: string | null;
  record_table?: string | null;
  record_type?: string | null;
  entity_type?: string | null;
  related_table?: string | null;
  record_id?: string | null;
  entity_id?: string | null;
  related_record_id?: string | null;
  person_id?: string | null;
  related_person_id?: string | null;
  actor_id?: string | null;
  actor_person_id?: string | null;
  description?: string | null;
  summary?: string | null;
  notes?: string | null;
  created_at?: string | null;
};

function formatValue(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value;
}

function formatDate(date?: string | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function activityPath(id: string) {
  return `/activity/${id}`;
}

function getActivityTitle(record: ActivityRecord) {
  return (
    record.action ||
    record.event_type ||
    record.summary ||
    "Activity record"
  );
}

function getActivityType(record: ActivityRecord) {
  return (
    record.event_type ||
    record.action ||
    record.record_type ||
    record.entity_type ||
    "—"
  );
}

function getActivityModule(record: ActivityRecord) {
  return (
    record.module ||
    record.record_table ||
    record.table_name ||
    record.related_table ||
    "—"
  );
}

function getTargetRecordId(record: ActivityRecord) {
  return record.record_id || record.entity_id || record.related_record_id || null;
}

function getPersonReferenceId(record: ActivityRecord) {
  return (
    record.related_person_id ||
    record.person_id ||
    record.actor_person_id ||
    record.actor_id ||
    null
  );
}

export default async function ActivityPage() {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false });

  const activityRecords = (data ?? []) as ActivityRecord[];

  return (
    <AppShell title="Activity" eyebrow="System Records">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Activity Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Activity</h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Review system activity, record changes, module events, linked record
          references, person references, and operational history.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Activity Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Live records pulled from the Supabase activity_log table.
            </p>
          </div>

          <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
            {activityRecords.length} records
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : activityRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No activity records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Activity records will appear here once the system begins logging
              record events or operational changes.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Activity</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Module / Table</th>
                  <th className="px-4 py-3 font-medium">Target Record ID</th>
                  <th className="px-4 py-3 font-medium">Person Reference ID</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Activity ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {activityRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={activityPath(record.id)}
                        className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        {getActivityTitle(record)}
                      </Link>

                      {record.description || record.summary ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-[var(--muted-foreground)]">
                          {record.description || record.summary}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(getActivityType(record))}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(getActivityModule(record))}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(getTargetRecordId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(getPersonReferenceId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatDate(record.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={activityPath(record.id)}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={activityPath(record.id)}
                        className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        View record
                      </Link>
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
