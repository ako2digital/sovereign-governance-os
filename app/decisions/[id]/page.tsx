import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type DecisionsDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type DecisionRecord = {
  id: string;
  title?: string | null;
  decision?: string | null;
  decision_text?: string | null;
  description?: string | null;
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

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type MinutesRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  minutes_date?: string | null;
  summary?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type DocumentRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  file_url?: string | null;
  status?: string | null;
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

function huiPath(id: string) {
  return `/hui/${id}`;
}

function minutesPath(id: string) {
  return `/minutes/${id}`;
}

function documentPath(id: string) {
  return `/documents/${id}`;
}

function isUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://");
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

export default async function DecisionsDetailPage({
  params,
}: DecisionsDetailPageProps) {
  const { id } = await params;

  const { data: decisionData, error: decisionError } = await supabase
    .from("decisions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const decision = decisionData as DecisionRecord | null;

  const linkedHuiId = decision?.hui_id || decision?.related_hui_id || null;
  const linkedMinutesId =
    decision?.minutes_id || decision?.related_minutes_id || null;
  const linkedDocumentId =
    decision?.document_id || decision?.related_document_id || null;

  const { data: huiData, error: huiError } = linkedHuiId
    ? await supabase.from("hui").select("*").eq("id", linkedHuiId).maybeSingle()
    : { data: null, error: null };

  const { data: minutesData, error: minutesError } = linkedMinutesId
    ? await supabase
        .from("minutes")
        .select("*")
        .eq("id", linkedMinutesId)
        .maybeSingle()
    : { data: null, error: null };

  const { data: documentData, error: documentError } = linkedDocumentId
    ? await supabase
        .from("documents")
        .select("*")
        .eq("id", linkedDocumentId)
        .maybeSingle()
    : { data: null, error: null };

  const linkedHui = huiData as HuiRecord | null;
  const linkedMinutes = minutesData as MinutesRecord | null;
  const linkedDocument = documentData as DocumentRecord | null;

  const decisionTitle = decision?.title || "Untitled decision record";
  const decisionBody =
    decision?.decision || decision?.decision_text || decision?.description;
  const decisionDate =
    decision?.decision_date || decision?.effective_date || decision?.date;

  const linkedHuiTitle = linkedHui?.title || "Untitled hui record";
  const linkedHuiDate = linkedHui?.hui_date || linkedHui?.date || null;

  const linkedMinutesTitle =
    linkedMinutes?.title || "Untitled minutes record";
  const linkedMinutesDate =
    linkedMinutes?.minutes_date || linkedMinutes?.date || null;

  const linkedDocumentTitle =
    linkedDocument?.title || linkedDocument?.name || "Untitled document record";

  const linkedDocumentFileUrl = linkedDocument?.file_url ?? null;
  const hasLinkedDocumentFileUrl = isUrl(linkedDocumentFileUrl);

  const hasActualRelatedLinks = Boolean(
    linkedHui || linkedMinutes || linkedDocument
  );

  return (
    <AppShell title="Decision Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Decision Record
        </p>

        {decisionError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {decisionError.message}
            </pre>
          </>
        ) : !decision ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Decision record not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No decision record exists for this ID. Return to the decisions
              register and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {decisionTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This page displays the selected decision record and only the
              records actually linked to it through confirmed database fields.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Decision Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Confirmed fields from the Supabase decisions table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/decisions"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to Decisions
            </Link>

            <Link
              href="/decisions/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Decision
            </Link>
          </div>
        </div>

        {decision ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <p className="font-medium text-stone-100">
                    {decisionTitle}
                  </p>
                </FieldRow>

                <FieldRow label="Decision ID">
                  <Link
                    href={decisionPath(decision.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {decision.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Decision Date" darker>
                  {formatDate(decisionDate)}
                </FieldRow>

                {decision.status !== undefined ? (
                  <FieldRow label="Status">
                    {formatValue(decision.status)}
                  </FieldRow>
                ) : null}

                {decisionBody !== undefined ? (
                  <FieldRow label="Decision" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(decisionBody)}
                    </p>
                  </FieldRow>
                ) : null}

                {decision.summary !== undefined ? (
                  <FieldRow label="Summary">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(decision.summary)}
                    </p>
                  </FieldRow>
                ) : null}

                {decision.hui_id !== undefined ? (
                  <FieldRow label="Hui ID" darker>
                    {decision.hui_id && linkedHui ? (
                      <Link
                        href={huiPath(decision.hui_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {decision.hui_id}
                      </Link>
                    ) : (
                      formatValue(decision.hui_id)
                    )}
                  </FieldRow>
                ) : null}

                {decision.related_hui_id !== undefined ? (
                  <FieldRow label="Related Hui ID">
                    {decision.related_hui_id && linkedHui ? (
                      <Link
                        href={huiPath(decision.related_hui_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {decision.related_hui_id}
                      </Link>
                    ) : (
                      formatValue(decision.related_hui_id)
                    )}
                  </FieldRow>
                ) : null}

                {decision.minutes_id !== undefined ? (
                  <FieldRow label="Minutes ID" darker>
                    {decision.minutes_id && linkedMinutes ? (
                      <Link
                        href={minutesPath(decision.minutes_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {decision.minutes_id}
                      </Link>
                    ) : (
                      formatValue(decision.minutes_id)
                    )}
                  </FieldRow>
                ) : null}

                {decision.related_minutes_id !== undefined ? (
                  <FieldRow label="Related Minutes ID">
                    {decision.related_minutes_id && linkedMinutes ? (
                      <Link
                        href={minutesPath(decision.related_minutes_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {decision.related_minutes_id}
                      </Link>
                    ) : (
                      formatValue(decision.related_minutes_id)
                    )}
                  </FieldRow>
                ) : null}

                {decision.document_id !== undefined ? (
                  <FieldRow label="Document ID" darker>
                    {decision.document_id && linkedDocument ? (
                      <Link
                        href={documentPath(decision.document_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {decision.document_id}
                      </Link>
                    ) : (
                      formatValue(decision.document_id)
                    )}
                  </FieldRow>
                ) : null}

                {decision.related_document_id !== undefined ? (
                  <FieldRow label="Related Document ID">
                    {decision.related_document_id && linkedDocument ? (
                      <Link
                        href={documentPath(decision.related_document_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {decision.related_document_id}
                      </Link>
                    ) : (
                      formatValue(decision.related_document_id)
                    )}
                  </FieldRow>
                ) : null}

                <FieldRow label="Created" darker>
                  {formatDate(decision.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No decision record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The decision record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {huiError || minutesError || documentError ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Linked Records Error
          </h2>

          <div className="mt-6 grid gap-4">
            {huiError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Hui link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {huiError.message}
                </pre>
              </div>
            ) : null}

            {minutesError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Minutes link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {minutesError.message}
                </pre>
              </div>
            ) : null}

            {documentError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Document link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {documentError.message}
                </pre>
              </div>
            ) : null}
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
                This hui is directly linked to the current decision record.
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

      {linkedMinutes ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Minutes Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                These minutes are directly linked to the current decision
                record.
              </p>
            </div>

            <Link
              href={minutesPath(linkedMinutes.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Minutes
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <Link
                    href={minutesPath(linkedMinutes.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedMinutesTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Minutes ID">
                  <Link
                    href={minutesPath(linkedMinutes.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedMinutes.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Date" darker>
                  {formatDate(linkedMinutesDate)}
                </FieldRow>

                {linkedMinutes.summary !== undefined ? (
                  <FieldRow label="Summary">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(linkedMinutes.summary)}
                    </p>
                  </FieldRow>
                ) : null}

                {linkedMinutes.status !== undefined ? (
                  <FieldRow label="Status" darker>
                    {formatValue(linkedMinutes.status)}
                  </FieldRow>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedDocument ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Document Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This document is directly linked to the current decision record.
              </p>
            </div>

            <Link
              href={documentPath(linkedDocument.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Document
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <Link
                    href={documentPath(linkedDocument.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedDocumentTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Document ID">
                  <Link
                    href={documentPath(linkedDocument.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedDocument.id}
                  </Link>
                </FieldRow>

                {linkedDocument.document_type !== undefined ? (
                  <FieldRow label="Document Type" darker>
                    {formatValue(linkedDocument.document_type)}
                  </FieldRow>
                ) : null}

                {linkedDocument.file_url !== undefined ? (
                  <FieldRow label="File URL">
                    {hasLinkedDocumentFileUrl ? (
                      <a
                        href={linkedDocumentFileUrl ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {linkedDocumentFileUrl}
                      </a>
                    ) : (
                      formatValue(linkedDocumentFileUrl)
                    )}
                  </FieldRow>
                ) : null}

                {linkedDocument.status !== undefined ? (
                  <FieldRow label="Status" darker>
                    {formatValue(linkedDocument.status)}
                  </FieldRow>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {decision && hasActualRelatedLinks ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Related Links
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Only records directly linked to this decision record are shown
                here.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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

            {linkedMinutes ? (
              <Link
                href={minutesPath(linkedMinutes.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedMinutesTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked minutes record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedMinutes.id}
                </p>
              </Link>
            ) : null}

            {linkedDocument ? (
              <Link
                href={documentPath(linkedDocument.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedDocumentTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked document record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedDocument.id}
                </p>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}