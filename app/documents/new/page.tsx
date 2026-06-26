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

type WhenuaRecord = {
  id: string;
  title?: string | null;
  block_name?: string | null;
  location?: string | null;
  created_at?: string | null;
};

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
  location?: string | null;
  created_at?: string | null;
};

async function createDocument(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const documentType = String(formData.get("document_type") || "").trim();
  const fileUrl = String(formData.get("file_url") || "").trim();
  const storagePath = String(formData.get("storage_path") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const sensitivityLevel = String(
    formData.get("sensitivity_level") || ""
  ).trim();
  const relatedHuiId = String(formData.get("related_hui_id") || "").trim();
  const relatedWhenuaId = String(
    formData.get("related_whenua_id") || ""
  ).trim();
  const relatedMaraeId = String(
    formData.get("related_marae_id") || ""
  ).trim();

  if (!title) {
    return;
  }

  const { data, error } = await supabase.from("documents").insert({
    title,
    document_type: documentType || null,
    file_url: fileUrl || null,
    storage_path: storagePath || null,
    summary: summary || null,
    description: description || null,
    notes: notes || null,
    status: status || null,
    sensitivity_level: sensitivityLevel || null,
    related_hui_id: relatedHuiId || null,
    related_whenua_id: relatedWhenuaId || null,
    related_marae_id: relatedMaraeId || null,
  }).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/documents/${data.id}`);
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

function whenuaPath(id: string) {
  return `/whenua/${id}`;
}

function maraePath(id: string) {
  return `/marae/${id}`;
}

function getHuiTitle(record: HuiRecord) {
  return record.title || "Untitled hui record";
}

function getHuiDate(record: HuiRecord) {
  return record.hui_date || record.date || null;
}

function getWhenuaTitle(record: WhenuaRecord) {
  return record.title || "Untitled whenua record";
}

function getMaraeName(record: MaraeRecord) {
  return record.name || record.title || "Untitled marae record";
}

export default async function AddDocumentPage() {
  const { data: huiData, error: huiError } = await supabase
    .from("hui")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: whenuaData, error: whenuaError } = await supabase
    .from("whenua_records")
    .select(
      `
      id,
      title,
      block_name,
      location,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  const { data: maraeData, error: maraeError } = await supabase
    .from("marae_records")
    .select("*")
    .order("created_at", { ascending: false });

  const huiRecords = (huiData ?? []) as HuiRecord[];
  const whenuaRecords = (whenuaData ?? []) as WhenuaRecord[];
  const maraeRecords = (maraeData ?? []) as MaraeRecord[];

  return (
    <AppShell title="Add Document" eyebrow="Documents Module">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          New Document Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
          Add Document
        </h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Create a document record with its title, type, file reference,
          storage path, summary, description, notes, sensitivity, status, and
          optional links to hui, whenua, or marae records.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Document Details
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Enter the confirmed document information. Only the title is
              required at this stage.
            </p>
          </div>

          <Link
            href="/documents"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Documents
          </Link>
        </div>

        {huiError || whenuaError || maraeError ? (
          <div className="mt-6 grid gap-4">
            {huiError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Hui database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {huiError.message}
                </pre>
              </div>
            ) : null}

            {whenuaError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Whenua database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {whenuaError.message}
                </pre>
              </div>
            ) : null}

            {maraeError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Marae database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {maraeError.message}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}

        <form action={createDocument} className="mt-6 grid gap-5">
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
              placeholder="Example: Hapū data governance proposal"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="document_type"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Document Type
              </label>

              <input
                id="document_type"
                name="document_type"
                type="text"
                placeholder="Example: proposal, minutes, evidence, policy, archive"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
              />
            </div>

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
                <option value="active">Active</option>
                <option value="under review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="file_url"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              File URL
            </label>

            <input
              id="file_url"
              name="file_url"
              type="text"
              placeholder="Enter document URL if stored externally"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="storage_path"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Storage Path
            </label>

            <input
              id="storage_path"
              name="storage_path"
              type="text"
              placeholder="Enter internal storage path or Supabase storage reference"
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
              placeholder="Enter a short summary of the document"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Enter document context, purpose, source, or usage notes"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Internal Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={5}
              placeholder="Enter internal notes, review comments, or follow-up context"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="sensitivity_level"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Sensitivity Level
            </label>

            <select
              id="sensitivity_level"
              name="sensitivity_level"
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">Select sensitivity</option>
              <option value="public">Public</option>
              <option value="internal">Internal</option>
              <option value="restricted">Restricted</option>
              <option value="highly sensitive">Highly Sensitive</option>
            </select>
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
                htmlFor="related_whenua_id"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Related Whenua
              </label>

              <select
                id="related_whenua_id"
                name="related_whenua_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="">No related whenua</option>

                {whenuaRecords.map((whenua) => (
                  <option key={whenua.id} value={whenua.id}>
                    {getWhenuaTitle(whenua)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="related_marae_id"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Related Marae
              </label>

              <select
                id="related_marae_id"
                name="related_marae_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="">No related marae</option>

                {maraeRecords.map((marae) => (
                  <option key={marae.id} value={marae.id}>
                    {getMaraeName(marae)}
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
              Create Document
            </button>

            <Link
              href="/documents"
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
                Add hui records before linking them to documents.
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
                Available Whenua
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Existing whenua records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {whenuaRecords.length} records
            </div>
          </div>

          {whenuaRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No whenua records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add whenua records before linking them to documents.
              </p>

              <div className="mt-5">
                <Link
                  href="/whenua/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Whenua
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Block</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {whenuaRecords.map((whenua) => (
                    <tr
                      key={whenua.id}
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={whenuaPath(whenua.id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {getWhenuaTitle(whenua)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(whenua.block_name)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={whenuaPath(whenua.id)}
                          className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          View whenua
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
                Available Marae
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Existing marae records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {maraeRecords.length} records
            </div>
          </div>

          {maraeRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No marae records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add marae records before linking them to documents.
              </p>

              <div className="mt-5">
                <Link
                  href="/marae/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Marae
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {maraeRecords.map((marae) => (
                    <tr
                      key={marae.id}
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={maraePath(marae.id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {getMaraeName(marae)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(marae.location)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={maraePath(marae.id)}
                          className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          View marae
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
