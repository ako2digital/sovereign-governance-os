import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type FileRefPageProps = {
  params: Promise<{ recordType: string; recordId: string }>;
};

function getRecordDetailPath(recordType: string, recordId: string): string {
  const routes: Record<string, string> = {
    hui: `/hui/${recordId}`,
    marae_records: `/marae/${recordId}`,
    whenua: `/whenua/${recordId}`,
    people: `/people/${recordId}`,
    decisions: `/decisions/${recordId}`,
    minutes: `/minutes/${recordId}`,
    tasks: `/tasks/${recordId}`,
    documents: `/documents/${recordId}`,
    governance_records: `/governance/${recordId}`,
  };
  return routes[recordType] ?? `/${recordType}/${recordId}`;
}

function formatRecordTypeLabel(recordType: string): string {
  const labels: Record<string, string> = {
    hui: "Hui",
    marae_records: "Marae Record",
    whenua: "Whenua",
    people: "Person",
    decisions: "Decision",
    minutes: "Minutes",
    tasks: "Task",
    documents: "Document",
    governance_records: "Governance Record",
  };
  return labels[recordType] ?? recordType.replace(/_/g, " ");
}

async function createFileReference(
  recordType: string,
  recordId: string,
  formData: FormData
) {
  "use server";

  const { error } = await supabase.from("record_files").insert({
    record_type: recordType,
    record_id: recordId,
    file_name: formData.get("file_name")?.toString().trim() || null,
    source_url: formData.get("source_url")?.toString().trim() || null,
    public_url: formData.get("public_url")?.toString().trim() || null,
    file_description:
      formData.get("file_description")?.toString().trim() || null,
    document_type:
      formData.get("document_type")?.toString().trim() || null,
    evidence_category:
      formData.get("evidence_category")?.toString().trim() || null,
    version_label:
      formData.get("version_label")?.toString().trim() || null,
    expiry_date: formData.get("expiry_date")?.toString().trim() || null,
    review_date: formData.get("review_date")?.toString().trim() || null,
    sensitivity_level:
      formData.get("sensitivity_level")?.toString().trim() || "internal",
    access_notes: formData.get("access_notes")?.toString().trim() || null,
    verification_status:
      formData.get("verification_status")?.toString().trim() || "unregistered",
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(getRecordDetailPath(recordType, recordId));
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]";

const selectClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]";

const labelClass = "block text-sm font-medium text-[var(--foreground)]";

const groupHeadingClass =
  "text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]";

export default async function AddFileReferencePage({
  params,
}: FileRefPageProps) {
  const { recordType, recordId } = await params;

  const recordLabel = formatRecordTypeLabel(recordType);
  const returnPath = getRecordDetailPath(recordType, recordId);

  const boundCreateFileRef = createFileReference.bind(
    null,
    recordType,
    recordId
  );

  return (
    <AppShell title="Add File Reference" eyebrow="Records">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          {recordLabel}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Add File Reference
        </h1>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Register a document, evidence file, or URL reference linked to this{" "}
          {recordLabel.toLowerCase()}. No file is uploaded here — add the source
          URL or location reference.
        </p>
      </section>

      {/* ── Form ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            File Details
          </h2>
          <Link
            href={returnPath}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Cancel
          </Link>
        </div>

        <form action={boundCreateFileRef} className="mt-6 space-y-8">
          {/* File Identity */}
          <div>
            <h3 className={groupHeadingClass}>File Identity</h3>

            <div className="mt-4 grid gap-5">
              <div>
                <label htmlFor="file_name" className={labelClass}>
                  File Name
                </label>
                <input
                  id="file_name"
                  name="file_name"
                  type="text"
                  placeholder="e.g. Trust Deed 2022, AGM Minutes March 2024, Funding Agreement"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="file_description" className={labelClass}>
                  Description
                </label>
                <input
                  id="file_description"
                  name="file_description"
                  type="text"
                  placeholder="Brief description of what this document contains or proves"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* URLs */}
          <div>
            <h3 className={groupHeadingClass}>Source and Access</h3>

            <div className="mt-4 grid gap-5">
              <div>
                <label htmlFor="source_url" className={labelClass}>
                  Source URL
                </label>
                <input
                  id="source_url"
                  name="source_url"
                  type="url"
                  placeholder="Original source — Google Drive, SharePoint, OneDrive, website"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="public_url" className={labelClass}>
                  Public URL
                </label>
                <input
                  id="public_url"
                  name="public_url"
                  type="url"
                  placeholder="Public or shared access link, if different from source"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="access_notes" className={labelClass}>
                  Access Notes
                </label>
                <input
                  id="access_notes"
                  name="access_notes"
                  type="text"
                  placeholder="How to access this file — credentials needed, location, contact"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div>
            <h3 className={groupHeadingClass}>Classification</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="document_type" className={labelClass}>
                  Document Type
                </label>
                <select
                  id="document_type"
                  name="document_type"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Select type</option>
                  <option value="trust_deed">Trust Deed</option>
                  <option value="constitution">Constitution</option>
                  <option value="agm_minutes">AGM Minutes</option>
                  <option value="hui_minutes">Hui Minutes</option>
                  <option value="resolution">Resolution</option>
                  <option value="report">Report</option>
                  <option value="plan">Plan</option>
                  <option value="agreement">Agreement / Contract</option>
                  <option value="funding_agreement">Funding Agreement</option>
                  <option value="funding_application">
                    Funding Application
                  </option>
                  <option value="certificate">Certificate</option>
                  <option value="survey">Survey / Valuation</option>
                  <option value="photograph">Photograph</option>
                  <option value="correspondence">Correspondence</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="evidence_category" className={labelClass}>
                  Evidence Category
                </label>
                <select
                  id="evidence_category"
                  name="evidence_category"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Select category</option>
                  <option value="governance">Governance</option>
                  <option value="land">Land / Whenua</option>
                  <option value="financial">Financial</option>
                  <option value="legal">Legal</option>
                  <option value="operational">Operational</option>
                  <option value="historical">Historical</option>
                  <option value="cultural">Cultural</option>
                  <option value="environmental">Environmental</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="version_label" className={labelClass}>
                  Version / Edition
                </label>
                <input
                  id="version_label"
                  name="version_label"
                  type="text"
                  placeholder="e.g. v1.0, 2024 edition, Amended March 2023"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="verification_status" className={labelClass}>
                  Verification Status
                </label>
                <select
                  id="verification_status"
                  name="verification_status"
                  defaultValue="unregistered"
                  className={selectClass}
                >
                  <option value="unregistered">Unregistered</option>
                  <option value="registered">Registered</option>
                  <option value="verified">Verified</option>
                  <option value="expired">Expired</option>
                  <option value="superseded">Superseded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className={groupHeadingClass}>Review and Expiry Dates</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="review_date" className={labelClass}>
                  Next Review Date
                </label>
                <input
                  id="review_date"
                  name="review_date"
                  type="date"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="expiry_date" className={labelClass}>
                  Expiry / End Date
                </label>
                <input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Sensitivity */}
          <div>
            <h3 className={groupHeadingClass}>Sensitivity</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="sensitivity_level" className={labelClass}>
                  Sensitivity Level
                </label>
                <select
                  id="sensitivity_level"
                  name="sensitivity_level"
                  defaultValue="internal"
                  className={selectClass}
                >
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="restricted">Restricted</option>
                  <option value="highly sensitive">Highly Sensitive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Save File Reference
            </button>
            <Link
              href={returnPath}
              className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
