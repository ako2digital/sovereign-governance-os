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
    <AppShell title="Documents" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Documents Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Documents
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage document records, file references, document types, status,
          sensitivity levels, summaries, and confirmed relational references.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Documents Register
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase documents table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {documentRecords.length} records
            </div>

            <Link
              href="/documents/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Document
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : documentRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No document records yet
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add the first document record to begin building the documentation
              and archive layer.
            </p>

            <div className="mt-5">
              <Link
                href="/documents/new"
                className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add First Document
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
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
                    className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={documentsPath(record.id)}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {getDocumentTitle(record)}
                      </Link>

                      {record.summary ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-stone-500">
                          {record.summary}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.document_type)}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.sensitivity_level)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="line-clamp-2 max-w-xs break-all font-mono text-xs text-stone-500">
                        {formatValue(getDocumentReference(record))}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-stone-500">
                        {formatValue(record.related_hui_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={documentsPath(record.id)}
                        className="font-mono text-xs text-stone-500 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={documentsPath(record.id)}
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