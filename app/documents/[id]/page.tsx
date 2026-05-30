import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type DocumentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type DocumentRecord = {
  id: string;
  title: string;
  document_type: string | null;
  description: string | null;
  file_url: string | null;
  external_reference: string | null;
  related_person_id: string | null;
  related_whenua_id: string | null;
  related_marae_id: string | null;
  related_hui_id: string | null;
  related_decision_id: string | null;
  sensitivity_level: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
};

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  const { id } = await params;

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
      related_person_id,
      related_whenua_id,
      related_marae_id,
      related_hui_id,
      related_decision_id,
      sensitivity_level,
      status,
      created_by,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const documentRecord = data as DocumentRecord | null;

  return (
    <AppShell title="Document Detail" eyebrow="Documents Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/documents"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Documents
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Document Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {documentRecord?.title || "Document Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected document record from the hapū relational
          infrastructure database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !documentRecord ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Document not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No document record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the documents table, with linked related
                records.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Title
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {documentRecord.title}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Document Type
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {documentRecord.document_type || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Status
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {documentRecord.status || "draft"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Sensitivity
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {documentRecord.sensitivity_level || "standard"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {documentRecord.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Updated
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {documentRecord.updated_at || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Description
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                {documentRecord.description || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                File References
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    File URL
                  </p>

                  {documentRecord.file_url ? (
                    <a
                      href={documentRecord.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {documentRecord.file_url}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    External Reference
                  </p>
                  <p className="mt-3 break-all text-sm text-stone-300">
                    {documentRecord.external_reference || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Related Records
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Related Person
                  </p>

                  {documentRecord.related_person_id ? (
                    <a
                      href={`/people/${documentRecord.related_person_id}`}
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {documentRecord.related_person_id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Related Whenua
                  </p>

                  {documentRecord.related_whenua_id ? (
                    <a
                      href={`/whenua/${documentRecord.related_whenua_id}`}
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {documentRecord.related_whenua_id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Related Marae
                  </p>

                  {documentRecord.related_marae_id ? (
                    <a
                      href={`/marae/${documentRecord.related_marae_id}`}
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {documentRecord.related_marae_id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Related Hui
                  </p>

                  {documentRecord.related_hui_id ? (
                    <a
                      href={`/hui/${documentRecord.related_hui_id}`}
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {documentRecord.related_hui_id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Related Decision
                  </p>

                  {documentRecord.related_decision_id ? (
                    <a
                      href={`/decisions/${documentRecord.related_decision_id}`}
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {documentRecord.related_decision_id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Created By
                  </p>
                  <p className="mt-3 break-all text-sm text-stone-300">
                    {documentRecord.created_by || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Record ID
              </p>
              <p className="mt-3 break-all text-sm text-stone-300">
                {documentRecord.id}
              </p>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}