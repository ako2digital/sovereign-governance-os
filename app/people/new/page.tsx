import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

async function createPerson(formData: FormData) {
  "use server";

  const fullName = String(formData.get("full_name") || "").trim();
  if (!fullName) return;

  const { data, error } = await supabase
    .from("people")
    .insert({
      full_name: fullName,
      preferred_name:
        String(formData.get("preferred_name") || "").trim() || null,
      other_names: String(formData.get("other_names") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      phone: String(formData.get("phone") || "").trim() || null,
      role_title: String(formData.get("role_title") || "").trim() || null,
      affiliation: String(formData.get("affiliation") || "").trim() || null,
      marae: String(formData.get("marae") || "").trim() || null,
      hapu: String(formData.get("hapu") || "").trim() || null,
      iwi: String(formData.get("iwi") || "").trim() || null,
      status: String(formData.get("status") || "").trim() || null,
      sensitivity_level:
        String(formData.get("sensitivity_level") || "").trim() || null,
      profile_summary:
        String(formData.get("profile_summary") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
      consent_status:
        String(formData.get("consent_status") || "").trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create person record.");
  }

  redirect(`/people/${(data as { id: string }).id}`);
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]";

const selectClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]";

const labelClass = "block text-sm font-medium text-[var(--foreground)]";

const groupHeadingClass =
  "text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]";

const hintClass = "mt-1 text-xs text-[var(--muted-foreground)]";

export default function AddPersonPage() {
  return (
    <AppShell title="Add Person" eyebrow="People & Roles">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          People & Roles · New Person
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Add Person
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
          This profile helps the organisation understand who is involved, what role they hold,
          what capability they bring, what they consent to share, and how they connect to
          governance records, hui, decisions, tasks, evidence, reporting, and outcomes.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Person Details
          </h2>

          <Link
            href="/people"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to People
          </Link>
        </div>

        <form action={createPerson} className="mt-6 space-y-8">
          {/* Core identity */}
          <div>
            <h3 className={groupHeadingClass}>Identity</h3>
            <p className={hintClass}>Legal name, preferred name, and other known names for this person.</p>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="full_name" className={labelClass}>
                  Full Name{" "}
                  <span className="text-[var(--accent)]" aria-hidden="true">
                    *
                  </span>
                </label>

                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="Legal or full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="preferred_name" className={labelClass}>
                  Preferred Name
                </label>

                <input
                  id="preferred_name"
                  name="preferred_name"
                  type="text"
                  placeholder="Name used in everyday correspondence"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="other_names" className={labelClass}>
                  Other Names
                </label>

                <input
                  id="other_names"
                  name="other_names"
                  type="text"
                  placeholder="Maiden name or other known names"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className={groupHeadingClass}>Contact Details</h3>
            <p className={hintClass}>Contact information held by the organisation for this person.</p>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Organisation role */}
          <div>
            <h3 className={groupHeadingClass}>Organisation Role</h3>
            <p className={hintClass}>The primary role or title this person holds within or in relation to the organisation.</p>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="role_title" className={labelClass}>
                  Role / Title
                </label>

                <input
                  id="role_title"
                  name="role_title"
                  type="text"
                  placeholder="Example: Trustee, Kaumātua, Secretary"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="affiliation" className={labelClass}>
                  Affiliation
                </label>

                <input
                  id="affiliation"
                  name="affiliation"
                  type="text"
                  placeholder="Organisation, trust, or group name"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Affiliations */}
          <div>
            <h3 className={groupHeadingClass}>Affiliations</h3>
            <p className={hintClass}>Hapū, marae, and iwi connections for this person.</p>

            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="marae" className={labelClass}>
                  Marae
                </label>

                <input
                  id="marae"
                  name="marae"
                  type="text"
                  placeholder="Marae name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="hapu" className={labelClass}>
                  Hapū
                </label>

                <input
                  id="hapu"
                  name="hapu"
                  type="text"
                  placeholder="Hapū name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="iwi" className={labelClass}>
                  Iwi
                </label>

                <input
                  id="iwi"
                  name="iwi"
                  type="text"
                  placeholder="Iwi name"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Sensitivity / consent */}
          <div>
            <h3 className={groupHeadingClass}>Consent and Sensitivity</h3>
            <p className={hintClass}>
              Controls what information about this person may be shared externally.
              The organisation decides what is shared, why it is shared, and what process authorised it.
            </p>

            <div className="mt-4 grid gap-5 md:grid-cols-3">
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
                  <option value="inactive">Inactive</option>
                  <option value="honorary">Honorary</option>
                </select>
              </div>

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
                <label htmlFor="consent_status" className={labelClass}>
                  Consent Status
                </label>

                <select
                  id="consent_status"
                  name="consent_status"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Select consent status</option>
                  <option value="given">Given</option>
                  <option value="pending">Pending</option>
                  <option value="not_given">Not Given</option>
                  <option value="not_required">Not Required</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className={groupHeadingClass}>Notes & Profile Summary</h3>
            <p className={hintClass}>A brief summary of this person&apos;s role, contribution, or significance to the organisation.</p>

            <div className="mt-4 grid gap-5">
              <div>
                <label htmlFor="profile_summary" className={labelClass}>
                  Profile Summary
                </label>

                <textarea
                  id="profile_summary"
                  name="profile_summary"
                  rows={3}
                  placeholder="Brief summary of this person's role, contribution, or significance"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="notes" className={labelClass}>
                  Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Additional context, notes, or reference information"
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
              Save Person Record
            </button>

            <Link
              href="/people"
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
