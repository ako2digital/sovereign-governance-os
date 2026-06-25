import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type KnowledgeNewPageProps = {
  params: Promise<{ id: string }>;
};

async function createKnowledgeRecord(personId: string, formData: FormData) {
  "use server";

  const recordType = String(formData.get("record_type") || "").trim();
  if (!recordType) return;

  const { error } = await supabase.from("person_knowledge_records").insert({
    person_id: personId,
    record_type: recordType,
    title: String(formData.get("title") || "").trim() || null,
    summary: String(formData.get("summary") || "").trim() || null,
    content: String(formData.get("content") || "").trim() || null,
    source_name: String(formData.get("source_name") || "").trim() || null,
    source_url: String(formData.get("source_url") || "").trim() || null,
    date_label: String(formData.get("date_label") || "").trim() || null,
    location: String(formData.get("location") || "").trim() || null,
    media_url: String(formData.get("media_url") || "").trim() || null,
    sensitivity_level:
      String(formData.get("sensitivity_level") || "").trim() || null,
    verification_status:
      String(formData.get("verification_status") || "").trim() || null,
    access_notes: String(formData.get("access_notes") || "").trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/people/${personId}`);
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]";

const selectClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]";

const labelClass = "block text-sm font-medium text-[var(--foreground)]";

const groupHeadingClass =
  "text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]";

const recordTypes = [
  "story",
  "korero",
  "whakatauki",
  "waiata",
  "composition",
  "news_article",
  "image",
  "video",
  "audio",
  "hui_reference",
  "minutes_reference",
  "document_reference",
  "achievement",
  "leadership_history",
  "land_history",
  "funding_evidence",
  "oral_history",
  "legend",
  "source_note",
  "verification_note",
];

export default async function KnowledgeNewPage({
  params,
}: KnowledgeNewPageProps) {
  const { id } = await params;

  const { data: personData } = await supabase
    .from("people")
    .select("id, full_name")
    .eq("id", id)
    .maybeSingle();

  const personName =
    (personData as { id: string; full_name: string } | null)?.full_name ??
    "Unknown person";

  const boundCreateKnowledgeRecord = createKnowledgeRecord.bind(null, id);

  return (
    <AppShell title="Add Knowledge Record" eyebrow="People Module">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Knowledge Archive
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Add Knowledge Record
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
          Archive a story, kōrero, whakataukī, reference, or cultural record
          linked to <strong className="text-[var(--foreground)]">{personName}</strong>.
          Knowledge records are archival — they cannot be edited after creation.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Record Details
          </h2>

          <Link
            href={`/people/${id}`}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Cancel
          </Link>
        </div>

        <form action={boundCreateKnowledgeRecord} className="mt-6 space-y-8">
          {/* Type and title */}
          <div>
            <h3 className={groupHeadingClass}>Record Type and Title</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="record_type" className={labelClass}>
                  Record Type{" "}
                  <span className="text-[var(--accent)]" aria-hidden="true">
                    *
                  </span>
                </label>

                <select
                  id="record_type"
                  name="record_type"
                  required
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select record type
                  </option>

                  {recordTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className={labelClass}>
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Short title or name for this record"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Summary and content */}
          <div>
            <h3 className={groupHeadingClass}>Content</h3>

            <div className="mt-4 grid gap-5">
              <div>
                <label htmlFor="summary" className={labelClass}>
                  Summary
                </label>

                <textarea
                  id="summary"
                  name="summary"
                  rows={3}
                  placeholder="Brief description or abstract of this record"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="content" className={labelClass}>
                  Full Content
                </label>

                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  placeholder="The full text, kōrero, whakataukī, or archival content"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Source */}
          <div>
            <h3 className={groupHeadingClass}>Source Details</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="source_name" className={labelClass}>
                  Source Name
                </label>

                <input
                  id="source_name"
                  name="source_name"
                  type="text"
                  placeholder="Name of person, publication, or archive"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="source_url" className={labelClass}>
                  Source URL
                </label>

                <input
                  id="source_url"
                  name="source_url"
                  type="text"
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="date_label" className={labelClass}>
                  Date or Date Range
                </label>

                <input
                  id="date_label"
                  name="date_label"
                  type="text"
                  placeholder="Example: circa 1952, 14 March 1985, 1970s"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Place associated with this record"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="media_url" className={labelClass}>
                  Media URL
                </label>

                <input
                  id="media_url"
                  name="media_url"
                  type="text"
                  placeholder="Link to an image, audio, or video — URL only, no file upload"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Sensitivity and verification */}
          <div>
            <h3 className={groupHeadingClass}>Sensitivity and Verification</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="sensitivity_level" className={labelClass}>
                  Sensitivity Level
                </label>

                <select
                  id="sensitivity_level"
                  name="sensitivity_level"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Select sensitivity</option>
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="restricted">Restricted</option>
                  <option value="highly sensitive">Highly Sensitive</option>
                </select>
              </div>

              <div>
                <label htmlFor="verification_status" className={labelClass}>
                  Verification Status
                </label>

                <select
                  id="verification_status"
                  name="verification_status"
                  defaultValue="unverified"
                  className={selectClass}
                >
                  <option value="unverified">Unverified</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="challenged">Challenged</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="access_notes" className={labelClass}>
                  Access Notes
                </label>

                <textarea
                  id="access_notes"
                  name="access_notes"
                  rows={3}
                  placeholder="Any notes about who may access this record, restrictions, or cultural protocols"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Save Knowledge Record
            </button>

            <Link
              href={`/people/${id}`}
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
