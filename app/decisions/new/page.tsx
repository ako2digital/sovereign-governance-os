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

  const { data, error } = await supabase.from("decisions").insert({
    title,
    decision_text: decisionText || null,
    summary: summary || null,
    status: status || null,
    decision_date: decisionDate || null,
    effective_date: effectiveDate || null,
    related_hui_id: relatedHuiId || null,
    related_minutes_id: relatedMinutesId || null,
    related_document_id: relatedDocumentId || null,
  }).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/decisions/${data.id}`);
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
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          New Decision Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
          Add Decision
        </h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Create a decision record with its title, decision text, summary,
          status, decision date, effective date, and optional links to hui,
          minutes, or document records.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Decision Details
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Enter the confirmed decision information. Only the title is
              required at this stage.
            </p>
          </div>

          <Link
            href="/decisions"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
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
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Approve hapū data governance working group"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="decision_text"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Decision Text
            </label>

            <textarea
              id="decision_text"
              name="decision_text"
              rows={6}
              placeholder="Enter the actual decision, resolution, motion, or confirmed outcome"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="summary"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Summary
            </label>

            <textarea
              id="summary"
              name="summary"
              rows={5}
              placeholder="Enter decision context, reason, or brief supporting explanation"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Decision Date
              </label>

              <input
                id="decision_date"
                name="decision_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="effective_date"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Effective Date
              </label>

              <input
                id="effective_date"
                name="effective_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="related_hui_id"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Related Hui
              </label>

              <select
                id="related_hui_id"
                name="related_hui_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Related Minutes
              </label>

              <select
                id="related_minutes_id"
                name="related_minutes_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Related Document
              </label>

              <select
                id="related_document_id"
                name="related_document_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Create Decision
            </button>

            <Link
              href="/decisions"
              className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Available Hui
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Existing hui records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {huiRecords.length} records
            </div>
          </div>

          {huiRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No hui records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add hui records before linking them to decisions.
              </p>

              <div className="mt-5">
                <Link
                  href="/hui/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Hui
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
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
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={huiPath(hui.id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {getHuiTitle(hui)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatDate(getHuiDate(hui))}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={huiPath(hui.id)}
                          className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
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

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Available Minutes
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Existing minutes records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {minutesRecords.length} records
            </div>
          </div>

          {minutesRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No minutes records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add minutes records before linking them to decisions.
              </p>

              <div className="mt-5">
                <Link
                  href="/minutes/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Minutes
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
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
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={minutesPath(minutes.id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {getMinutesTitle(minutes)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatDate(getMinutesDate(minutes))}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={minutesPath(minutes.id)}
                          className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
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

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Available Documents
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Existing document records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {documentRecords.length} records
            </div>
          </div>

          {documentRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No document records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add document records before linking them to decisions.
              </p>

              <div className="mt-5">
                <Link
                  href="/documents/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Document
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
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
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={documentPath(document.id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {getDocumentTitle(document)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(document.document_type)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={documentPath(document.id)}
                          className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
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
