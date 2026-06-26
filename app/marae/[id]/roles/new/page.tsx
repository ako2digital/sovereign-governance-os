import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type AddRoleTermPageProps = {
  params: Promise<{ id: string }>;
};

type PersonOption = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  role_title: string | null;
};

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
};

type HuiOption = {
  id: string;
  title?: string | null;
  hui_date?: string | null;
  date?: string | null;
};

type MinutesOption = {
  id: string;
  title?: string | null;
  minutes_date?: string | null;
};

type DecisionOption = {
  id: string;
  title?: string | null;
  decision_date?: string | null;
};

type DocumentOption = {
  id: string;
  title?: string | null;
  name?: string | null;
};

async function createGovernanceRoleTerm(maraeId: string, formData: FormData) {
  "use server";

  const personId = formData.get("person_id")?.toString().trim() || null;
  const roleTitle = formData.get("role_title")?.toString().trim() || null;

  if (!personId || !roleTitle) {
    throw new Error("Person and role title are required.");
  }

  const relatedHuiId =
    formData.get("related_hui_id")?.toString().trim() || null;
  const relatedMinutesId =
    formData.get("related_minutes_id")?.toString().trim() || null;
  const relatedDecisionId =
    formData.get("related_decision_id")?.toString().trim() || null;
  const relatedDocumentId =
    formData.get("related_document_id")?.toString().trim() || null;
  const termStart =
    formData.get("term_start_date")?.toString().trim() || null;
  const termEnd = formData.get("term_end_date")?.toString().trim() || null;
  const appointedAt =
    formData.get("appointed_at")?.toString().trim() || null;
  const electedAt = formData.get("elected_at")?.toString().trim() || null;
  const agmDate = formData.get("agm_date")?.toString().trim() || null;

  const { error } = await supabase.from("governance_role_terms").insert({
    person_id: personId,
    marae_id: maraeId,
    organisation_record_type: "marae_records",
    organisation_record_id: maraeId,
    role_title: roleTitle,
    role_type: formData.get("role_type")?.toString().trim() || null,
    appointment_method:
      formData.get("appointment_method")?.toString().trim() || null,
    appointed_at: appointedAt || null,
    elected_at: electedAt || null,
    agm_date: agmDate || null,
    term_start_date: termStart || null,
    term_end_date: termEnd || null,
    status: formData.get("status")?.toString().trim() || "active",
    related_hui_id: relatedHuiId || null,
    related_minutes_id: relatedMinutesId || null,
    related_decision_id: relatedDecisionId || null,
    related_document_id: relatedDocumentId || null,
    notes: formData.get("notes")?.toString().trim() || null,
    sensitivity_level:
      formData.get("sensitivity_level")?.toString().trim() || "internal",
    verification_status:
      formData.get("verification_status")?.toString().trim() || "unverified",
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/marae/${maraeId}`);
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]";

const selectClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]";

const labelClass = "block text-sm font-medium text-[var(--foreground)]";

const groupHeadingClass =
  "text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]";

export default async function AddRoleTermPage({
  params,
}: AddRoleTermPageProps) {
  const { id } = await params;

  const [maraeResult, peopleResult, huiResult, minutesResult, decisionsResult, documentsResult] =
    await Promise.all([
      supabase
        .from("marae_records")
        .select("id, name, title")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("people")
        .select("id, full_name, preferred_name, role_title")
        .order("full_name"),
      supabase
        .from("hui")
        .select("id, title, hui_date, date")
        .order("created_at", { ascending: false }),
      supabase
        .from("minutes")
        .select("id, title, minutes_date")
        .order("created_at", { ascending: false }),
      supabase
        .from("decisions")
        .select("id, title, decision_date")
        .order("created_at", { ascending: false }),
      supabase
        .from("documents")
        .select("id, title, name")
        .order("created_at", { ascending: false }),
    ]);

  const marae = maraeResult.data as MaraeRecord | null;
  const people = (peopleResult.data ?? []) as PersonOption[];
  const huiRecords = (huiResult.data ?? []) as HuiOption[];
  const minutesRecords = (minutesResult.data ?? []) as MinutesOption[];
  const decisionRecords = (decisionsResult.data ?? []) as DecisionOption[];
  const documentRecords = (documentsResult.data ?? []) as DocumentOption[];

  const maraeName = marae?.name || marae?.title || "Marae record";
  const boundCreateTerm = createGovernanceRoleTerm.bind(null, id);

  if (!marae) {
    return (
      <AppShell title="Add Governance Role" eyebrow="Marae Module">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
          <h1 className="text-3xl font-semibold text-[var(--foreground)]">
            Marae record not found
          </h1>
          <Link
            href="/marae"
            className="mt-5 inline-block rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Marae
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title="Add Governance Role" eyebrow="Marae Module">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Governance Role Term
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Add Role / Trustee
        </h1>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Recording a governance role for:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {maraeName}
          </span>
        </p>
      </section>

      {/* ── Form ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Role Term Details
          </h2>
          <Link
            href={`/marae/${id}`}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Cancel
          </Link>
        </div>

        <form action={boundCreateTerm} className="mt-6 space-y-8">
          {/* Core Role */}
          <div>
            <h3 className={groupHeadingClass}>Core Role</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="person_id" className={labelClass}>
                  Person{" "}
                  <span className="text-[var(--accent)]" aria-hidden="true">
                    *
                  </span>
                </label>
                <select
                  id="person_id"
                  name="person_id"
                  defaultValue=""
                  required
                  className={selectClass}
                >
                  <option value="">Select person</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.preferred_name
                        ? `${p.preferred_name} (${p.full_name})`
                        : p.full_name}
                      {p.role_title ? ` — ${p.role_title}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="role_title" className={labelClass}>
                  Role Title{" "}
                  <span className="text-[var(--accent)]" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="role_title"
                  name="role_title"
                  type="text"
                  required
                  placeholder="e.g. Trustee, Chair, Secretary, Treasurer"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="role_type" className={labelClass}>
                  Role Type
                </label>
                <select
                  id="role_type"
                  name="role_type"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Select type</option>
                  <option value="trustee">Trustee</option>
                  <option value="chair">Chair</option>
                  <option value="secretary">Secretary</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="director">Director</option>
                  <option value="committee_member">Committee Member</option>
                  <option value="cultural_advisor">Cultural Advisor</option>
                  <option value="delegate">Delegate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className={labelClass}>
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="active"
                  className={selectClass}
                >
                  <option value="active">Active</option>
                  <option value="resigned">Resigned</option>
                  <option value="retired">Retired</option>
                  <option value="term_expired">Term Expired</option>
                  <option value="removed">Removed</option>
                  <option value="on_leave">On Leave</option>
                  <option value="acting">Acting</option>
                </select>
              </div>

              <div>
                <label htmlFor="appointment_method" className={labelClass}>
                  Appointment Method
                </label>
                <select
                  id="appointment_method"
                  name="appointment_method"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Select method</option>
                  <option value="elected_agm">Elected at AGM</option>
                  <option value="elected_hui">Elected at Hui</option>
                  <option value="appointed_board">Appointed by Board</option>
                  <option value="appointed_chair">Appointed by Chair</option>
                  <option value="by_rotation">By Rotation</option>
                  <option value="co_opted">Co-opted</option>
                  <option value="hereditary_role">Hereditary Role</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className={groupHeadingClass}>Key Dates</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="term_start_date" className={labelClass}>
                  Term Start Date
                </label>
                <input
                  id="term_start_date"
                  name="term_start_date"
                  type="date"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="term_end_date" className={labelClass}>
                  Term End Date
                </label>
                <input
                  id="term_end_date"
                  name="term_end_date"
                  type="date"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="agm_date" className={labelClass}>
                  AGM / Appointment Date
                </label>
                <input
                  id="agm_date"
                  name="agm_date"
                  type="date"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="appointed_at" className={labelClass}>
                  Confirmed Appointment Date
                </label>
                <input
                  id="appointed_at"
                  name="appointed_at"
                  type="date"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="elected_at" className={labelClass}>
                  Election Date
                </label>
                <input
                  id="elected_at"
                  name="elected_at"
                  type="date"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Governance Source Links */}
          <div>
            <h3 className={groupHeadingClass}>Source Governance Records</h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Link the hui, minutes, decision, or document that records this
              appointment. These are the proof of appointment.
            </p>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="related_hui_id" className={labelClass}>
                  Appointment / AGM Hui
                </label>
                <select
                  id="related_hui_id"
                  name="related_hui_id"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">No linked hui</option>
                  {huiRecords.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.title || "Untitled hui"}
                      {(h.hui_date || h.date)
                        ? ` — ${new Date(h.hui_date ?? h.date ?? "").toLocaleDateString("en-NZ", { day: "2-digit", month: "short", year: "numeric" })}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="related_minutes_id" className={labelClass}>
                  Appointment Minutes
                </label>
                <select
                  id="related_minutes_id"
                  name="related_minutes_id"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">No linked minutes</option>
                  {minutesRecords.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title || "Untitled minutes"}
                      {m.minutes_date
                        ? ` — ${new Date(m.minutes_date).toLocaleDateString("en-NZ", { day: "2-digit", month: "short", year: "numeric" })}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="related_decision_id" className={labelClass}>
                  Appointment Decision
                </label>
                <select
                  id="related_decision_id"
                  name="related_decision_id"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">No linked decision</option>
                  {decisionRecords.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title || "Untitled decision"}
                      {d.decision_date
                        ? ` — ${new Date(d.decision_date).toLocaleDateString("en-NZ", { day: "2-digit", month: "short", year: "numeric" })}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="related_document_id" className={labelClass}>
                  Warrant / Document
                </label>
                <select
                  id="related_document_id"
                  name="related_document_id"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">No linked document</option>
                  {documentRecords.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title || doc.name || "Untitled document"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes and Sensitivity */}
          <div>
            <h3 className={groupHeadingClass}>Notes and Sensitivity</h3>

            <div className="mt-4 grid gap-5">
              <div>
                <label htmlFor="notes" className={labelClass}>
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Additional notes about this appointment, term, or role"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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
                    <option value="document_verified">Document Verified</option>
                    <option value="minutes_verified">Minutes Verified</option>
                    <option value="agm_verified">AGM Verified</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Save Role Term
            </button>
            <Link
              href={`/marae/${id}`}
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
