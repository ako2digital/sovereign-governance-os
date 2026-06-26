import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type AddAttendeePageProps = {
  params: Promise<{ id: string }>;
};

type PersonOption = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  role_title: string | null;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  hui_date?: string | null;
  date?: string | null;
};

async function createHuiAttendee(huiId: string, formData: FormData) {
  "use server";

  const personId = formData.get("person_id")?.toString().trim() || null;
  const displayName = formData.get("display_name")?.toString().trim() || null;

  if (!personId && !displayName) {
    throw new Error(
      "Either a person record or a display name is required."
    );
  }

  const { error } = await supabase.from("hui_attendees").insert({
    hui_id: huiId,
    person_id: personId || null,
    display_name: displayName || null,
    attendance_status:
      formData.get("attendance_status")?.toString().trim() || "attended",
    attendee_role:
      formData.get("attendee_role")?.toString().trim() || null,
    organisation_name:
      formData.get("organisation_name")?.toString().trim() || null,
    contact_notes:
      formData.get("contact_notes")?.toString().trim() || null,
    contribution_notes:
      formData.get("contribution_notes")?.toString().trim() || null,
    sensitivity_level:
      formData.get("sensitivity_level")?.toString().trim() || "internal",
    verification_status: "unverified",
  });

  if (error) {
    if (error.code === "23P01") {
      throw new Error(
        "This person is already recorded as an attendee for this hui."
      );
    }
    throw new Error(error.message);
  }

  redirect(`/hui/${huiId}`);
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]";

const selectClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]";

const labelClass = "block text-sm font-medium text-[var(--foreground)]";

const groupHeadingClass =
  "text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]";

export default async function AddAttendeePage({
  params,
}: AddAttendeePageProps) {
  const { id } = await params;

  const [huiResult, peopleResult] = await Promise.all([
    supabase.from("hui").select("id, title, hui_date, date").eq("id", id).maybeSingle(),
    supabase
      .from("people")
      .select("id, full_name, preferred_name, role_title")
      .order("full_name"),
  ]);

  const hui = huiResult.data as HuiRecord | null;
  const people = (peopleResult.data ?? []) as PersonOption[];

  const huiTitle = hui?.title || "Hui record";
  const boundCreateAttendee = createHuiAttendee.bind(null, id);

  if (!hui) {
    return (
      <AppShell title="Add Attendee" eyebrow="Hui Module">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
          <h1 className="text-3xl font-semibold text-[var(--foreground)]">
            Hui record not found
          </h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            No hui record exists for this ID.
          </p>
          <Link
            href="/hui"
            className="mt-5 inline-block rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Hui
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title="Add Attendee" eyebrow="Hui Module">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Hui Attendance
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Add Attendee
        </h1>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Recording attendance for:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {huiTitle}
          </span>
        </p>
      </section>

      {/* ── Form ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Attendee Details
          </h2>
          <Link
            href={`/hui/${id}`}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Cancel
          </Link>
        </div>

        <form action={boundCreateAttendee} className="mt-6 space-y-8">
          {/* Person */}
          <div>
            <h3 className={groupHeadingClass}>Person</h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Select an existing person record or enter a display name.
              At least one is required.
            </p>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="person_id" className={labelClass}>
                  Person Record
                </label>
                <select
                  id="person_id"
                  name="person_id"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">No linked person record</option>
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
                <label htmlFor="display_name" className={labelClass}>
                  Display Name
                </label>
                <input
                  id="display_name"
                  name="display_name"
                  type="text"
                  placeholder="Name if not in People register"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div>
            <h3 className={groupHeadingClass}>Attendance</h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="attendance_status" className={labelClass}>
                  Attendance Status
                </label>
                <select
                  id="attendance_status"
                  name="attendance_status"
                  defaultValue="attended"
                  className={selectClass}
                >
                  <option value="attended">Attended</option>
                  <option value="apology">Apology</option>
                  <option value="invited">Invited</option>
                  <option value="absent">Absent</option>
                  <option value="arrived_late">Arrived Late</option>
                  <option value="left_early">Left Early</option>
                </select>
              </div>

              <div>
                <label htmlFor="attendee_role" className={labelClass}>
                  Role at Hui
                </label>
                <select
                  id="attendee_role"
                  name="attendee_role"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">No specific role</option>
                  <option value="attendee">Attendee</option>
                  <option value="chair">Chair</option>
                  <option value="recorder">Recorder / Minute Taker</option>
                  <option value="presenter">Presenter</option>
                  <option value="trustee">Trustee</option>
                  <option value="service_provider">Service Provider</option>
                  <option value="observer">Observer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Organisation and notes */}
          <div>
            <h3 className={groupHeadingClass}>Organisation and Notes</h3>

            <div className="mt-4 grid gap-5">
              <div>
                <label htmlFor="organisation_name" className={labelClass}>
                  Organisation
                </label>
                <input
                  id="organisation_name"
                  name="organisation_name"
                  type="text"
                  placeholder="Organisation, trust, agency, or group name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="contact_notes" className={labelClass}>
                  Contact / Attendance Notes
                </label>
                <input
                  id="contact_notes"
                  name="contact_notes"
                  type="text"
                  placeholder="Brief notes about this attendee's attendance or contact"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="contribution_notes" className={labelClass}>
                  Contribution Notes
                </label>
                <input
                  id="contribution_notes"
                  name="contribution_notes"
                  type="text"
                  placeholder="What this person presented, contributed, or discussed"
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
              Add Attendee
            </button>
            <Link
              href={`/hui/${id}`}
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
