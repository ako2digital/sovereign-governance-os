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
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Decisions Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Decisions
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage decision records, decision dates, status, linked hui,
          linked minutes, linked documents, and supporting governance context.
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

            <Link
              href="/decisions/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Decision
            </Link>
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
              Add the first decision record to begin building the formal
              decision layer.
            </p>

            <div className="mt-5">
              <Link
                href="/decisions/new"
                className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add First Decision
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
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
                    className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={decisionPath(record.id)}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {getDecisionTitle(record)}
                      </Link>

                      {record.summary ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-stone-500">
                          {record.summary}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatDate(getDecisionDate(record))}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-stone-500">
                        {formatValue(getLinkedHuiId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-stone-500">
                        {formatValue(getLinkedMinutesId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-stone-500">
                        {formatValue(getLinkedDocumentId(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={decisionPath(record.id)}
                        className="font-mono text-xs text-stone-500 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={decisionPath(record.id)}
                        className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
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