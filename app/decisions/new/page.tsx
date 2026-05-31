import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  created_at?: string | null;
};

type MinutesRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  minutes_date?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type DocumentRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  status?: string | null;
  created_at?: string | null;
};

async function createDecision(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const decisionText = String(formData.get("decision_text") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const decisionDate = String(formData.get("decision_date") || "").trim();
  const effectiveDate = String(formData.get("effective_date") || "").trim();
  const relatedHuiId = String(formData.get("related_hui_id") || "").trim();
  const relatedMinutesId = String(
    formData.get("related_minutes_id") || ""
  ).trim();
  const relatedDocumentId = String(
    formData.get("related_document_id") || ""
  ).trim();

  if (!title) {
    return;
  }

  const { error } = await supabase.from("decisions").insert({
    title,
    decision_text: decisionText || null,
    summary: summary || null,
    status: status || null,
    decision_date: decisionDate || null,
    effective_date: effectiveDate || null,
    related_hui_id: relatedHuiId || null,
    related_minutes_id: relatedMinutesId || null,
    related_document_id: relatedDocumentId || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/decisions");
}

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

function huiPath(id: string) {
  return `/hui/${id}`;
}

function minutesPath(id: string) {
  return `/minutes/${id}`;
}

function documentPath(id: string) {
  return `/documents/${id}`;
}

function getHuiTitle(record: HuiRecord) {
  return record.title || "Untitled hui record";
}

function getHuiDate(record: HuiRecord) {
  return record.hui_date || record.date || null;
}

function getMinutesTitle(record: MinutesRecord) {
  return record.title || "Untitled minutes record";
}

function getMinutesDate(record: MinutesRecord) {
  return record.minutes_date || record.date || null;
}

function getDocumentTitle(record: DocumentRecord) {
  return record.title || record.name || "Untitled document record";
}

export default async function AddDecisionPage() {
  const { data: huiData, error: huiError } = await supabase
    .from("hui")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: minutesData, error: minutesError } = await supabase
    .from("minutes")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: documentData, error: documentError } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  const huiRecords = (huiData ?? []) as HuiRecord[];
  const minutesRecords = (minutesData ?? []) as MinutesRecord[];
  const documentRecords = (documentData ?? []) as DocumentRecord[];

  return (
    <AppShell title="Add Decision" eyebrow="Decisions Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          New Decision Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Decision
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a decision record with its title, decision text, summary,
          status, decision date, effective date, and optional links to hui,
          minutes, or document records.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Decision Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Enter the confirmed decision information. Only the title is
              required at this stage.
            </p>
          </div>

          <Link
            href="/decisions"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Back to Decisions
          </Link>
        </div>

        {huiError || minutesError || documentError ? (
          <div className="mt-6 grid gap-4">
            {huiError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Hui database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {huiError.message}
                </pre>
              </div>
            ) : null}

            {minutesError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Minutes database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {minutesError.message}
                </pre>
              </div>
            ) : null}

            {documentError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Documents database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {documentError.message}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}

        <form action={createDecision} className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-stone-300"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Approve hapū data governance working group"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div>
            <label
              htmlFor="decision_text"
              className="text-sm font-medium text-stone-300"
            >
              Decision Text
            </label>

            <textarea
              id="decision_text"
              name="decision_text"
              rows={6}
              placeholder="Enter the actual decision, resolution, motion, or confirmed outcome"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div>
            <label
              htmlFor="summary"
              className="text-sm font-medium text-stone-300"
            >
              Summary
            </label>

            <textarea
              id="summary"
              name="summary"
              rows={5}
              placeholder="Enter decision context, reason, or brief supporting explanation"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-stone-300"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">Select status</option>
                <option value="draft">Draft</option>
                <option value="proposed">Proposed</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="superseded">Superseded</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="decision_date"
                className="text-sm font-medium text-stone-300"
              >
                Decision Date
              </label>

              <input
                id="decision_date"
                name="decision_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              />
            </div>

            <div>
              <label
                htmlFor="effective_date"
                className="text-sm font-medium text-stone-300"
              >
                Effective Date
              </label>

              <input
                id="effective_date"
                name="effective_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="related_hui_id"
                className="text-sm font-medium text-stone-300"
              >
                Related Hui
              </label>

              <select
                id="related_hui_id"
                name="related_hui_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">No related hui</option>

                {huiRecords.map((hui) => (
                  <option key={hui.id} value={hui.id}>
                    {getHuiTitle(hui)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="related_minutes_id"
                className="text-sm font-medium text-stone-300"
              >
                Related Minutes
              </label>

              <select
                id="related_minutes_id"
                name="related_minutes_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">No related minutes</option>

                {minutesRecords.map((minutes) => (
                  <option key={minutes.id} value={minutes.id}>
                    {getMinutesTitle(minutes)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="related_document_id"
                className="text-sm font-medium text-stone-300"
              >
                Related Document
              </label>

              <select
                id="related_document_id"
                name="related_document_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">No related document</option>

                {documentRecords.map((document) => (
                  <option key={document.id} value={document.id}>
                    {getDocumentTitle(document)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Create Decision
            </button>

            <Link
              href="/decisions"
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Available Hui
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Existing hui records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {huiRecords.length} records
            </div>
          </div>

          {huiRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
              <h3 className="text-base font-semibold text-white">
                No hui records available
              </h3>

              <p className="mt-2 text-sm text-stone-400">
                Add hui records before linking them to decisions.
              </p>

              <div className="mt-5">
                <Link
                  href="/hui/new"
                  className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Add Hui
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {huiRecords.map((hui) => (
                    <tr
                      key={hui.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={huiPath(hui.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {getHuiTitle(hui)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatDate(getHuiDate(hui))}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={huiPath(hui.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View hui
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Available Minutes
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Existing minutes records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {minutesRecords.length} records
            </div>
          </div>

          {minutesRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
              <h3 className="text-base font-semibold text-white">
                No minutes records available
              </h3>

              <p className="mt-2 text-sm text-stone-400">
                Add minutes records before linking them to decisions.
              </p>

              <div className="mt-5">
                <Link
                  href="/minutes/new"
                  className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Add Minutes
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {minutesRecords.map((minutes) => (
                    <tr
                      key={minutes.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={minutesPath(minutes.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {getMinutesTitle(minutes)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatDate(getMinutesDate(minutes))}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={minutesPath(minutes.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View minutes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Available Documents
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Existing document records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {documentRecords.length} records
            </div>
          </div>

          {documentRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
              <h3 className="text-base font-semibold text-white">
                No document records available
              </h3>

              <p className="mt-2 text-sm text-stone-400">
                Add document records before linking them to decisions.
              </p>

              <div className="mt-5">
                <Link
                  href="/documents/new"
                  className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Add Document
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {documentRecords.map((document) => (
                    <tr
                      key={document.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={documentPath(document.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {getDocumentTitle(document)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(document.document_type)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={documentPath(document.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View document
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}