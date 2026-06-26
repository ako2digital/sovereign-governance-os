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

type DocumentRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  status?: string | null;
  created_at?: string | null;
};

async function createPanui(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const publishDate = String(formData.get("publish_date") || "").trim();
  const relatedHuiId = String(formData.get("related_hui_id") || "").trim();
  const relatedDocumentId = String(
    formData.get("related_document_id") || ""
  ).trim();

  if (!title) {
    return;
  }

  const { error } = await supabase.from("panui").insert({
    title,
    message: message || null,
    summary: summary || null,
    status: status || null,
    publish_date: publishDate || null,
    related_hui_id: relatedHuiId || null,
    related_document_id: relatedDocumentId || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/panui");
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

function documentPath(id: string) {
  return `/documents/${id}`;
}

function getHuiTitle(record: HuiRecord) {
  return record.title || "Untitled hui record";
}

function getHuiDate(record: HuiRecord) {
  return record.hui_date || record.date || null;
}

function getDocumentTitle(record: DocumentRecord) {
  return record.title || record.name || "Untitled document record";
}

export default async function AddPanuiPage() {
  const { data: huiData, error: huiError } = await supabase
    .from("hui")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: documentData, error: documentError } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  const huiRecords = (huiData ?? []) as HuiRecord[];
  const documentRecords = (documentData ?? []) as DocumentRecord[];

  return (
    <AppShell title="Add Pānui" eyebrow="Pānui Module">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
          New Pānui Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
          Add Pānui
        </h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Create a pānui record with its title, message, summary, publication
          date, status, and optional links to hui or document records.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Pānui Details
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Enter the confirmed communication record. Only the title is
              required at this stage.
            </p>
          </div>

          <Link
            href="/panui"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Pānui
          </Link>
        </div>

        {huiError || documentError ? (
          <div className="mt-6 grid gap-4">
            {huiError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Hui database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {huiError.message}
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

        <form action={createPanui} className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Notice of upcoming hapū hui"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="publish_date"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Publish Date
              </label>

              <input
                id="publish_date"
                name="publish_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-[var(--foreground)]"
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
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="summary"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Summary
            </label>

            <textarea
              id="summary"
              name="summary"
              rows={4}
              placeholder="Enter a short summary for the pānui"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Message
            </label>

            <textarea
              id="message"
              name="message"
              rows={8}
              placeholder="Enter the full pānui message or communication text"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="related_hui_id"
                className="text-sm font-medium text-[var(--foreground)]"
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
                htmlFor="related_document_id"
                className="text-sm font-medium text-[var(--foreground)]"
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
              Create Pānui
            </button>

            <Link
              href="/panui"
              className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
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

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground)]">
              {huiRecords.length} records
            </div>
          </div>

          {huiRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No hui records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add hui records before linking them to pānui.
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
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Location</th>
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

                      <td className="px-4 py-4 text-[var(--foreground)]">
                        {formatDate(getHuiDate(hui))}
                      </td>

                      <td className="px-4 py-4 text-[var(--foreground)]">
                        {formatValue(hui.location)}
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
                Available Documents
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Existing document records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground)]">
              {documentRecords.length} records
            </div>
          </div>

          {documentRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No document records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add document records before linking them to pānui.
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
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
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

                      <td className="px-4 py-4 text-[var(--foreground)]">
                        {formatValue(document.document_type)}
                      </td>

                      <td className="px-4 py-4 text-[var(--foreground)]">
                        {formatValue(document.status)}
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
