import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type DocumentsDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

type DecisionRecord = {
  id: string;
  title?: string | null;
  decision?: string | null;
  decision_text?: string | null;
  status?: string | null;
  date?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
  document_id?: string | null;
  related_document_id?: string | null;
  created_at?: string | null;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type WhenuaRecord = {
  id: string;
  title?: string | null;
  block_name?: string | null;
  location?: string | null;
  status?: string | null;
  sensitivity_level?: string | null;
  created_at?: string | null;
};

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
  location?: string | null;
  description?: string | null;
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

function isUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://");
}

function documentPath(id: string) {
  return `/documents/${id}`;
}

function decisionPath(id: string) {
  return `/decisions/${id}`;
}

function huiPath(id: string) {
  return `/hui/${id}`;
}

function whenuaPath(id: string) {
  return `/whenua/${id}`;
}

function maraePath(id: string) {
  return `/marae/${id}`;
}

function FieldRow({
  label,
  children,
  darker = false,
}: {
  label: string;
  children: React.ReactNode;
  darker?: boolean;
}) {
  return (
    <tr
      className={`border-t border-stone-800 ${
        darker ? "bg-stone-950" : "bg-stone-900"
      }`}
    >
      <th className="w-56 px-4 py-4 align-top font-medium text-stone-400">
        {label}
      </th>

      <td className="px-4 py-4 text-stone-300">{children}</td>
    </tr>
  );
}

export default async function DocumentsDetailPage({
  params,
}: DocumentsDetailPageProps) {
  const { id } = await params;

  const { data: documentData, error: documentError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const document = documentData as DocumentRecord | null;

  const linkedHuiId = document?.related_hui_id ?? null;
  const linkedWhenuaId = document?.related_whenua_id ?? null;
  const linkedMaraeId = document?.related_marae_id ?? null;

  const { data: decisionData, error: decisionError } = await supabase
    .from("decisions")
    .select("*")
    .order("created_at", { ascending: false });

  const linkedDecisions = ((decisionData ?? []) as DecisionRecord[]).filter(
    (decision) =>
      decision.document_id === id || decision.related_document_id === id
  );

  const { data: huiData, error: huiError } = linkedHuiId
    ? await supabase.from("hui").select("*").eq("id", linkedHuiId).maybeSingle()
    : { data: null, error: null };

  const { data: whenuaData, error: whenuaError } = linkedWhenuaId
    ? await supabase
        .from("whenua_records")
        .select("*")
        .eq("id", linkedWhenuaId)
        .maybeSingle()
    : { data: null, error: null };

  const { data: maraeData, error: maraeError } = linkedMaraeId
    ? await supabase
        .from("marae_records")
        .select("*")
        .eq("id", linkedMaraeId)
        .maybeSingle()
    : { data: null, error: null };

  const linkedHui = huiData as HuiRecord | null;
  const linkedWhenua = whenuaData as WhenuaRecord | null;
  const linkedMarae = maraeData as MaraeRecord | null;

  const documentTitle =
    document?.title || document?.name || "Untitled document record";

  const documentUrl = document?.file_url || document?.url || null;
  const hasDocumentUrl = isUrl(documentUrl);

  const linkedHuiTitle = linkedHui?.title || "Untitled hui record";
  const linkedHuiDate = linkedHui?.hui_date || linkedHui?.date || null;

  const linkedWhenuaTitle = linkedWhenua?.title || "Untitled whenua record";

  const linkedMaraeName =
    linkedMarae?.name || linkedMarae?.title || "Untitled marae record";

  const hasActualRelatedLinks = Boolean(
    hasDocumentUrl ||
      linkedDecisions.length > 0 ||
      linkedHui ||
      linkedWhenua ||
      linkedMarae
  );

  return (
    <AppShell title="Document Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Document Record
        </p>

        {documentError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {documentError.message}
            </pre>
          </>
        ) : !document ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Document record not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No document record exists for this ID. Return to the documents
              register and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {documentTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This page displays the selected document record and only the
              records actually linked to it through confirmed database fields.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Document Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Confirmed fields from the Supabase documents table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/documents"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to Documents
            </Link>

            <Link
              href="/documents/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Document
            </Link>
          </div>
        </div>

        {document ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <p className="font-medium text-stone-100">
                    {documentTitle}
                  </p>
                </FieldRow>

                <FieldRow label="Document ID">
                  <Link
                    href={documentPath(document.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {document.id}
                  </Link>
                </FieldRow>

                {document.document_type !== undefined ? (
                  <FieldRow label="Document Type" darker>
                    {formatValue(document.document_type)}
                  </FieldRow>
                ) : null}

                {document.status !== undefined ? (
                  <FieldRow label="Status">
                    {formatValue(document.status)}
                  </FieldRow>
                ) : null}

                {document.sensitivity_level !== undefined ? (
                  <FieldRow label="Sensitivity Level" darker>
                    {formatValue(document.sensitivity_level)}
                  </FieldRow>
                ) : null}

                {documentUrl !== undefined ? (
                  <FieldRow label="File URL">
                    {hasDocumentUrl ? (
                      <a
                        href={documentUrl ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {documentUrl}
                      </a>
                    ) : (
                      formatValue(documentUrl)
                    )}
                  </FieldRow>
                ) : null}

                {document.storage_path !== undefined ? (
                  <FieldRow label="Storage Path" darker>
                    <span className="font-mono text-xs text-stone-400">
                      {formatValue(document.storage_path)}
                    </span>
                  </FieldRow>
                ) : null}

                {document.summary !== undefined ? (
                  <FieldRow label="Summary">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(document.summary)}
                    </p>
                  </FieldRow>
                ) : null}

                {document.description !== undefined ? (
                  <FieldRow label="Description" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(document.description)}
                    </p>
                  </FieldRow>
                ) : null}

                {document.notes !== undefined ? (
                  <FieldRow label="Notes">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(document.notes)}
                    </p>
                  </FieldRow>
                ) : null}

                {document.related_hui_id !== undefined ? (
                  <FieldRow label="Related Hui ID" darker>
                    {document.related_hui_id && linkedHui ? (
                      <Link
                        href={huiPath(document.related_hui_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {document.related_hui_id}
                      </Link>
                    ) : (
                      formatValue(document.related_hui_id)
                    )}
                  </FieldRow>
                ) : null}

                {document.related_whenua_id !== undefined ? (
                  <FieldRow label="Related Whenua ID">
                    {document.related_whenua_id && linkedWhenua ? (
                      <Link
                        href={whenuaPath(document.related_whenua_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {document.related_whenua_id}
                      </Link>
                    ) : (
                      formatValue(document.related_whenua_id)
                    )}
                  </FieldRow>
                ) : null}

                {document.related_marae_id !== undefined ? (
                  <FieldRow label="Related Marae ID" darker>
                    {document.related_marae_id && linkedMarae ? (
                      <Link
                        href={maraePath(document.related_marae_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {document.related_marae_id}
                      </Link>
                    ) : (
                      formatValue(document.related_marae_id)
                    )}
                  </FieldRow>
                ) : null}

                <FieldRow label="Created">
                  {formatDate(document.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No document record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The document record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {decisionError || huiError || whenuaError || maraeError ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Linked Records Error
          </h2>

          <div className="mt-6 grid gap-4">
            {decisionError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Decision link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {decisionError.message}
                </pre>
              </div>
            ) : null}

            {huiError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Hui link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {huiError.message}
                </pre>
              </div>
            ) : null}

            {whenuaError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Whenua link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {whenuaError.message}
                </pre>
              </div>
            ) : null}

            {maraeError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Marae link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {maraeError.message}
                </pre>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {linkedDecisions.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Decisions
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Decision records directly linked to this document.
              </p>
            </div>

            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {linkedDecisions.length} linked decisions
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {linkedDecisions.map((decision) => {
                  const title =
                    decision.title || "Untitled decision record";

                  const date =
                    decision.decision_date ||
                    decision.effective_date ||
                    decision.date ||
                    null;

                  return (
                    <tr
                      key={decision.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={decisionPath(decision.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {title}
                        </Link>

                        <p className="mt-1 font-mono text-xs text-stone-600">
                          {decision.id}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatDate(date)}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(decision.status)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={decisionPath(decision.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View decision
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedHui ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Hui Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This hui is directly linked to the current document record.
              </p>
            </div>

            <Link
              href={huiPath(linkedHui.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Hui
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <Link
                    href={huiPath(linkedHui.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedHuiTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Hui ID">
                  <Link
                    href={huiPath(linkedHui.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedHui.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Date" darker>
                  {formatDate(linkedHuiDate)}
                </FieldRow>

                <FieldRow label="Location">
                  {formatValue(linkedHui.location)}
                </FieldRow>

                {linkedHui.status !== undefined ? (
                  <FieldRow label="Status" darker>
                    {formatValue(linkedHui.status)}
                  </FieldRow>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedWhenua ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Whenua Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This whenua is directly linked to the current document record.
              </p>
            </div>

            <Link
              href={whenuaPath(linkedWhenua.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Whenua
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <Link
                    href={whenuaPath(linkedWhenua.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedWhenuaTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Whenua ID">
                  <Link
                    href={whenuaPath(linkedWhenua.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedWhenua.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Block Name" darker>
                  {formatValue(linkedWhenua.block_name)}
                </FieldRow>

                <FieldRow label="Location">
                  {formatValue(linkedWhenua.location)}
                </FieldRow>

                {linkedWhenua.status !== undefined ? (
                  <FieldRow label="Status" darker>
                    {formatValue(linkedWhenua.status)}
                  </FieldRow>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedMarae ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Marae Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This marae is directly linked to the current document record.
              </p>
            </div>

            <Link
              href={maraePath(linkedMarae.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Marae
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Name" darker>
                  <Link
                    href={maraePath(linkedMarae.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedMaraeName}
                  </Link>
                </FieldRow>

                <FieldRow label="Marae ID">
                  <Link
                    href={maraePath(linkedMarae.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedMarae.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Location" darker>
                  {formatValue(linkedMarae.location)}
                </FieldRow>

                {linkedMarae.description !== undefined ? (
                  <FieldRow label="Description">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(linkedMarae.description)}
                    </p>
                  </FieldRow>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {document && hasActualRelatedLinks ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Related Links
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Only records directly linked to this document record are shown
                here.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {hasDocumentUrl ? (
              <a
                href={documentUrl ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  File URL
                </h3>

                <p className="mt-1 break-words text-sm text-stone-400">
                  Open external document link.
                </p>
              </a>
            ) : null}

            {linkedDecisions.map((decision) => (
              <Link
                key={decision.id}
                href={decisionPath(decision.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {decision.title || "Untitled decision record"}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked decision record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {decision.id}
                </p>
              </Link>
            ))}

            {linkedHui ? (
              <Link
                href={huiPath(linkedHui.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedHuiTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked hui record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedHui.id}
                </p>
              </Link>
            ) : null}

            {linkedWhenua ? (
              <Link
                href={whenuaPath(linkedWhenua.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedWhenuaTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked whenua record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedWhenua.id}
                </p>
              </Link>
            ) : null}

            {linkedMarae ? (
              <Link
                href={maraePath(linkedMarae.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedMaraeName}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked marae record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedMarae.id}
                </p>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}