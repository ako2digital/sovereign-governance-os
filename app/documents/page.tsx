import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type DocumentRecord = {
  id: string;
  title: string;
  document_type: string | null;
  description: string | null;
  file_url: string | null;
  external_reference: string | null;
  sensitivity_level: string | null;
  status: string | null;
  created_at: string;
  related_person: {
    full_name: string;
  } | null;
  related_whenua: {
    title: string;
  } | null;
  related_marae: {
    name: string;
  } | null;
  related_hui: {
    title: string;
  } | null;
  related_decision: {
    title: string;
  } | null;
};

export default async function DocumentsPage() {
  const { data, error } = await supabase
    .from("documents")
    .select(
      `
      id,
      title,
      document_type,
      description,
      file_url,
      external_reference,
      sensitivity_level,
      status,
      created_at,
      related_person:related_person_id (
        full_name
      ),
      related_whenua:related_whenua_id (
        title
      ),
      related_marae:related_marae_id (
        name
      ),
      related_hui:related_hui_id (
        title
      ),
      related_decision:related_decision_id (
        title
      )
    `
    )
    .order("created_at", { ascending: false });

  const documentRecords = (data ?? []) as unknown as DocumentRecord[];

  return (
    <AppShell title="Documents" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Document Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Documents</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Store document references, file links, evidence records, external
          references, and relational links across people, whenua, marae, hui,
          and decisions.
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

            <a
              href="/documents/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Document
            </a>
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
              Add the first document record to begin testing document and
              evidence tracking.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Related To</th>
                  <th className="px-4 py-3 font-medium">Sensitivity</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">File / Reference</th>
                </tr>
              </thead>

              <tbody>
                {documentRecords.map((record) => {
                  const relatedTo =
                    record.related_person?.full_name ||
                    record.related_whenua?.title ||
                    record.related_marae?.name ||
                    record.related_hui?.title ||
                    record.related_decision?.title ||
                    "—";

                  return (
                    <tr
                      key={record.id}
                      className="border-t border-stone-800 bg-stone-900"
                    >
                      <td className="px-4 py-4 text-stone-100">
                        {record.title}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {record.document_type || "—"}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {relatedTo}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {record.sensitivity_level || "standard"}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {record.status || "active"}
                      </td>
                      <td className="px-4 py-4 text-stone-300">
                        {record.file_url ? (
                          <a
                            href={record.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-stone-100 underline underline-offset-4"
                          >
                            Open file
                          </a>
                        ) : (
                          record.external_reference || "—"
                        )}
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