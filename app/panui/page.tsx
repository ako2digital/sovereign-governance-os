import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PanuiRecord = {
  id: string;
  title?: string | null;
  message?: string | null;
  content?: string | null;
  body?: string | null;
  summary?: string | null;
  status?: string | null;
  publish_date?: string | null;
  published_at?: string | null;
  date?: string | null;
  related_hui_id?: string | null;
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

function panuiPath(id: string) {
  return `/panui/${id}`;
}

function getPanuiTitle(record: PanuiRecord) {
  return record.title || "Untitled pānui record";
}

function getPanuiDate(record: PanuiRecord) {
  return record.published_at || record.publish_date || record.date || null;
}

function getPanuiPreview(record: PanuiRecord) {
  return record.summary || record.message || record.content || record.body || null;
}

export default async function PanuiPage() {
  const { data, error } = await supabase
    .from("panui")
    .select("*")
    .order("created_at", { ascending: false });

  const panuiRecords = (data ?? []) as PanuiRecord[];

  return (
    <AppShell title="Pānui" eyebrow="Marae">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Marae
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Pānui</h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Community notices, newsletters, and announcements published to
          whānau, members, and external stakeholders. Pānui records link to the
          hui they announce or follow up on, carry publication dates, and can
          reference supporting documents — keeping community communication
          traceable within the governance record.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Pānui Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {panuiRecords.length} {panuiRecords.length === 1 ? "pānui" : "pānui"} on record
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {panuiRecords.length} records
            </div>

            <Link
              href="/panui/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Pānui
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : panuiRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No pānui records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first pānui record to begin building the communication
              layer.
            </p>

            <div className="mt-5">
              <Link
                href="/panui/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Pānui
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Published</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Linked Hui ID</th>
                  <th className="px-4 py-3 font-medium">
                    Linked Document ID
                  </th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {panuiRecords.map((record) => {
                  const preview = getPanuiPreview(record);

                  return (
                    <tr
                      key={record.id}
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={panuiPath(record.id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                        >
                          {getPanuiTitle(record)}
                        </Link>

                        {preview ? (
                          <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-[var(--muted-foreground)]">
                            {preview}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-4 py-4 text-[var(--foreground)]">
                        {formatDate(getPanuiDate(record))}
                      </td>

                      <td className="px-4 py-4 text-[var(--foreground)]">
                        {formatValue(record.status)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-[var(--muted-foreground)]">
                          {formatValue(record.related_hui_id)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-[var(--muted-foreground)]">
                          {formatValue(record.related_document_id)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={panuiPath(record.id)}
                          className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:underline"
                        >
                          {record.id}
                        </Link>
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={panuiPath(record.id)}
                          className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                        >
                          View record
                        </Link>
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
