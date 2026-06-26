import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type LinkRefPageProps = {
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

async function createRecordLink(
  recordType: string,
  recordId: string,
  formData: FormData
) {
  "use server";

  const targetRecordType = String(formData.get("target_record_type") || "").trim();
  const targetRecordId = String(formData.get("target_record_id") || "").trim();
  const relationshipType = String(formData.get("relationship_type") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const sensitivityLevel = String(formData.get("sensitivity_level") || "").trim();

  if (!targetRecordType || !targetRecordId) {
    throw new Error("Target record type and target record ID are required.");
  }

  const { error } = await supabase.from("record_links").insert({
    source_record_type: recordType,
    source_record_id: recordId,
    target_record_type: targetRecordType,
    target_record_id: targetRecordId,
    relationship_type: relationshipType || null,
    title: title || null,
    summary: summary || null,
    sensitivity_level: sensitivityLevel || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(getRecordDetailPath(recordType, recordId));
}

const RECORD_TYPE_OPTIONS = [
  { value: "hui", label: "Hui" },
  { value: "marae_records", label: "Marae Record" },
  { value: "whenua", label: "Whenua" },
  { value: "people", label: "Person" },
  { value: "decisions", label: "Decision" },
  { value: "minutes", label: "Minutes" },
  { value: "tasks", label: "Task" },
  { value: "documents", label: "Document" },
  { value: "governance_records", label: "Governance Record" },
];

const RELATIONSHIP_TYPES = [
  { value: "references", label: "References" },
  { value: "supports", label: "Supports" },
  { value: "supersedes", label: "Supersedes" },
  { value: "implements", label: "Implements" },
  { value: "related_to", label: "Related to" },
  { value: "produced_by", label: "Produced by" },
  { value: "resulted_in", label: "Resulted in" },
  { value: "authorises", label: "Authorises" },
  { value: "evidence_for", label: "Evidence for" },
];

export default async function AddRecordLinkPage({ params }: LinkRefPageProps) {
  const { recordType, recordId } = await params;

  const boundCreateLink = createRecordLink.bind(null, recordType, recordId);
  const backPath = getRecordDetailPath(recordType, recordId);
  const sourceLabel = formatRecordTypeLabel(recordType);

  return (
    <AppShell title="Add Record Link" eyebrow="Linked Records">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Record Link / {sourceLabel}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Add Record Link
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Manually link this {sourceLabel.toLowerCase()} record to another record in the system. Use this for cross-record
          relationships that aren't captured by structured fields — for example, linking a decision to a supporting
          marae record, or connecting a whenua record to related governance documentation.
        </p>
        <p className="mt-2 max-w-2xl text-xs text-[var(--muted-foreground)]">
          Source record: <span className="font-medium text-[var(--foreground)]">{sourceLabel}</span> — ID: <span className="font-mono">{recordId}</span>
        </p>
        <div className="mt-5">
          <Link
            href={backPath}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            ← Back to {sourceLabel}
          </Link>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Link Details</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          You must provide the target record type and its exact ID (UUID). You can find record IDs on their detail pages.
        </p>

        <form action={boundCreateLink} className="mt-6 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="target_record_type"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Target Record Type <span className="text-red-400">*</span>
              </label>
              <select
                id="target_record_type"
                name="target_record_type"
                required
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="">Select record type</option>
                {RECORD_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="relationship_type"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Relationship Type
              </label>
              <select
                id="relationship_type"
                name="relationship_type"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="">Select relationship</option>
                {RELATIONSHIP_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="target_record_id"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Target Record ID (UUID) <span className="text-red-400">*</span>
            </label>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Paste the UUID from the target record's detail page. UUIDs look like: 550e8400-e29b-41d4-a716-446655440000
            </p>
            <input
              id="target_record_id"
              name="target_record_id"
              type="text"
              required
              placeholder="550e8400-e29b-41d4-a716-446655440000"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 font-mono text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Link Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Optional short label for this link"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
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
              rows={3}
              placeholder="Optional explanation of why these records are linked"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="sensitivity_level"
              className="text-sm font-medium text-[var(--foreground)]"
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

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Create Link
            </button>
            <Link
              href={backPath}
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
