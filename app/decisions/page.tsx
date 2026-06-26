import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type DecisionRecord = {
  id: string;
  title?: string | null;
  decision?: string | null;
  decision_text?: string | null;
  summary?: string | null;
  status?: string | null;
  date?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
  hui_id?: string | null;
  related_hui_id?: string | null;
  minutes_id?: string | null;
  related_minutes_id?: string | null;
  document_id?: string | null;
  related_document_id?: string | null;
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

function decisionPath(id: string) {
  return `/decisions/${id}`;
}

function getDecisionTitle(record: DecisionRecord) {
  return (
    record.title ||
    record.decision ||
    record.decision_text ||
    "Untitled decision record"
  );
}

function getDecisionDate(record: DecisionRecord) {
  return record.decision_date || record.effective_date || record.date || null;
}

function getLinkedHuiId(record: DecisionRecord) {
  return record.hui_id || record.related_hui_id || null;
}

function getLinkedMinutesId(record: DecisionRecord) {
  return record.minutes_id || record.related_minutes_id || null;
}

function getLinkedDocumentId(record: DecisionRecord) {
  return record.document_id || record.related_document_id || null;
}

export default async function DecisionsPage() {
  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .order("created_at", { ascending: false });

  const decisionRecords = (data ?? []) as DecisionRecord[];

  return (
    <AppShell title="Decisions" eyebrow="Core Records">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Decisions Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
          Decisions
        </h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Manage decision records, decision dates, status, linked hui,
          linked minutes, linked documents, and supporting governance context.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Decisions Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Live records pulled from the Supabase decisions table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {decisionRecords.length} records
            </div>

            <Link
              href="/decisions/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Decision
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : decisionRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No decision records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first decision record to begin building the formal
              decision layer.
            </p>

            <div className="mt-5">
              <Link
                href="/decisions/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Decision
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Decision</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Linked Hui ID</th>
                  <th className="px-4 py-3 font-medium">Linked Minutes ID</th>
                  <th className="px-4 py-3 font-medium">Linked Document ID</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {decisionRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={decisionPath(record.id)}
                        className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        {getDecisionTitle(record)}
                      </Link>

                      {record.summary ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-[var(--muted-foreground)]">
                          {record.summary}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatDate(getDecisionDate(record))}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(getLinkedHuiId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(getLinkedMinutesId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(getLinkedDocumentId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={decisionPath(record.id)}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={decisionPath(record.id)}
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
