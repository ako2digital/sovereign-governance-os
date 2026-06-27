import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type DocumentRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  file_url?: string | null;
  url?: string | null;
  storage_path?: string | null;
  description?: string | null;
  summary?: string | null;
  notes?: string | null;
  status?: string | null;
  sensitivity_level?: string | null;
  related_hui_id?: string | null;
  related_whenua_id?: string | null;
  related_marae_id?: string | null;
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

function documentsPath(id: string) {
  return `/documents/${id}`;
}

function getDocumentTitle(record: DocumentRecord) {
  return record.title || record.name || "Untitled document record";
}

function getDocumentReference(record: DocumentRecord) {
  return record.file_url || record.url || record.storage_path || null;
}

export default async function DocumentsPage() {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  const documentRecords = (data ?? []) as DocumentRecord[];

  return (
    <AppShell title="Documents" eyebrow="Library & Evidence">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Library & Evidence
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
          Documents
        </h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Document records and file references for the governance archive —
          deeds, reports, contracts, plans, correspondence, and supporting
          materials. Documents are not a separate module: they are the evidence layer
          that gives governance decisions their legal and historical weight.
          Link documents to the hui, whenua, or decisions they support to turn records into proof.
        </p>

        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            What belongs here
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Deeds, trust documents, contracts, legal correspondence, reports, plans, maps, photos,
            signed minutes, funding applications, council documents, environmental reports, and any
            document that supports a governance decision, whenua record, or mandate claim.
            Use the Evidence archive for file-level references. Use Documents for named, structured
            document records that belong in the governance register.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Documents Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {documentRecords.length} {documentRecords.length === 1 ? "document" : "documents"} on record
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {documentRecords.length} records
            </div>

            <Link
              href="/documents/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Document
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : documentRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No document records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first document record to begin building the documentation
              and archive layer.
            </p>

            <div className="mt-5">
              <Link
                href="/documents/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Document
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sensitivity</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Linked Hui ID</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {documentRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={documentsPath(record.id)}
                        className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        {getDocumentTitle(record)}
                      </Link>

                      {record.summary ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-[var(--muted-foreground)]">
                          {record.summary}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.document_type)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.sensitivity_level)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="line-clamp-2 max-w-xs break-all font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(getDocumentReference(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(record.related_hui_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={documentsPath(record.id)}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={documentsPath(record.id)}
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
