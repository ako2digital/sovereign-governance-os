import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MinutesRecord = {
  id: string;
  title?: string | null;
  hui_id?: string | null;
  related_hui_id?: string | null;
  date?: string | null;
  minutes_date?: string | null;
  summary?: string | null;
  content?: string | null;
  notes?: string | null;
  status?: string | null;
  approved_at?: string | null;
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

function minutesPath(id: string) {
  return `/minutes/${id}`;
}

function getMinutesTitle(record: MinutesRecord) {
  return record.title || "Untitled minutes record";
}

function getMinutesDate(record: MinutesRecord) {
  return record.minutes_date || record.date || null;
}

function getLinkedHuiId(record: MinutesRecord) {
  return record.hui_id || record.related_hui_id || null;
}

export default async function MinutesPage() {
  const { data, error } = await supabase
    .from("minutes")
    .select("*")
    .order("created_at", { ascending: false });

  const minutesRecords = (data ?? []) as MinutesRecord[];

  return (
    <AppShell title="Minutes" eyebrow="Governance">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Governance
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Minutes</h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          The official record of what was said, agreed, and resolved at every
          hui. Minutes are the authoritative narrative link between a meeting
          and its formal decisions — they make the governance chain auditable
          and defensible to funders, auditors, and future generations.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Minutes Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {minutesRecords.length} {minutesRecords.length === 1 ? "record" : "records"} on file
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {minutesRecords.length} records
            </div>

            <Link
              href="/minutes/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Minutes
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : minutesRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No minutes records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first minutes record to begin building the meeting
              documentation layer.
            </p>

            <div className="mt-5">
              <Link
                href="/minutes/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Minutes
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Approved</th>
                  <th className="px-4 py-3 font-medium">Linked Hui ID</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {minutesRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={minutesPath(record.id)}
                        className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        {getMinutesTitle(record)}
                      </Link>

                      {record.summary ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-[var(--muted-foreground)]">
                          {record.summary}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatDate(getMinutesDate(record))}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatDate(record.approved_at)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(getLinkedHuiId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={minutesPath(record.id)}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={minutesPath(record.id)}
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
