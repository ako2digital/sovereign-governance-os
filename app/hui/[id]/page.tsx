import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue, formatPersonName } from "@/lib/utils";

type HuiDetailPageProps = {
  params: Promise<{ id: string }>;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  agenda?: string | null;
  purpose?: string | null;
  summary?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type AttendeeRecord = {
  id: string;
  attendance_status: string | null;
  attendee_role: string | null;
  display_name: string | null;
  organisation_name: string | null;
  contact_notes: string | null;
  contribution_notes: string | null;
  sensitivity_level: string | null;
  created_at: string | null;
  person: {
    id: string;
    full_name: string;
    preferred_name: string | null;
    role_title: string | null;
  } | null;
};

type LinkedMinutes = {
  id: string;
  title: string | null;
  minutes_date: string | null;
  status: string | null;
  approved_at: string | null;
  created_at: string | null;
};

type LinkedDecision = {
  id: string;
  title: string | null;
  decision_date: string | null;
  status: string | null;
  created_at: string | null;
};

type LinkedTask = {
  id: string;
  title: string | null;
  status: string | null;
  priority: string | null;
  due_date: string | null;
  created_at: string | null;
  assigned_to_id: string | null;
  assigned_to: { full_name: string } | null;
};

type FileRecord = {
  id: string;
  file_name: string | null;
  file_type: string | null;
  source_url: string | null;
  public_url: string | null;
  file_description: string | null;
  document_type: string | null;
  evidence_category: string | null;
  version_label: string | null;
  sensitivity_level: string | null;
  verification_status: string | null;
  created_at: string | null;
};

type RecordLink = {
  id: string;
  source_record_type: string;
  source_record_id: string;
  target_record_type: string;
  target_record_id: string;
  relationship_type: string | null;
  title: string | null;
  summary: string | null;
  created_at: string | null;
};

function FieldRow({
  label,
  children,
  darker = false,
}: {
  label: string;
  children: React.ReactNode;
  darker?: boolean;
}) {
  return (
    <tr
      className={`border-t border-[var(--border)] ${
        darker ? "bg-[var(--surface)]" : "bg-[var(--surface-raised)]"
      }`}
    >
      <th className="w-56 px-4 py-4 align-top font-medium text-[var(--muted-foreground)]">
        {label}
      </th>
      <td className="px-4 py-4 text-[var(--foreground)]">{children}</td>
    </tr>
  );
}

function AttendeeLabel({ status }: { status: string | null }) {
  const map: Record<string, string> = {
    attended: "Attended",
    apology: "Apology",
    invited: "Invited",
    absent: "Absent",
    arrived_late: "Arrived Late",
    left_early: "Left Early",
  };
  return <span>{map[status ?? ""] ?? formatValue(status)}</span>;
}

export default async function HuiDetailPage({ params }: HuiDetailPageProps) {
  const { id } = await params;

  const [
    huiResult,
    tasksResult,
    attendeesResult,
    minutesResult,
    decisionsResult,
    filesResult,
    sourceLinksResult,
    targetLinksResult,
  ] = await Promise.all([
    supabase.from("hui").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("tasks")
      .select(
        "id, title, status, priority, due_date, created_at, assigned_to_id, assigned_to:assigned_to_id(full_name)"
      )
      .eq("related_hui_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("hui_attendees")
      .select(
        "id, attendance_status, attendee_role, display_name, organisation_name, contact_notes, contribution_notes, sensitivity_level, created_at, person:person_id(id, full_name, preferred_name, role_title)"
      )
      .eq("hui_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("minutes")
      .select("id, title, minutes_date, status, approved_at, created_at")
      .eq("related_hui_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("decisions")
      .select("id, title, decision_date, status, created_at")
      .eq("related_hui_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("record_files")
      .select(
        "id, file_name, file_type, source_url, public_url, file_description, document_type, evidence_category, version_label, sensitivity_level, verification_status, created_at"
      )
      .eq("record_type", "hui")
      .eq("record_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("record_links")
      .select(
        "id, source_record_type, source_record_id, target_record_type, target_record_id, relationship_type, title, summary, created_at"
      )
      .eq("source_record_type", "hui")
      .eq("source_record_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("record_links")
      .select(
        "id, source_record_type, source_record_id, target_record_type, target_record_id, relationship_type, title, summary, created_at"
      )
      .eq("target_record_type", "hui")
      .eq("target_record_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const hui = huiResult.data as HuiRecord | null;
  const linkedTasks = (tasksResult.data ?? []) as unknown as LinkedTask[];
  const attendees = (attendeesResult.data ?? []) as unknown as AttendeeRecord[];
  const linkedMinutes = (minutesResult.data ?? []) as LinkedMinutes[];
  const linkedDecisions = (decisionsResult.data ?? []) as LinkedDecision[];
  const fileRefs = (filesResult.data ?? []) as FileRecord[];
  const allLinks: RecordLink[] = [
    ...((sourceLinksResult.data ?? []) as RecordLink[]),
    ...((targetLinksResult.data ?? []) as RecordLink[]),
  ];

  const huiTitle = hui?.title || "Untitled hui record";
  const huiDate = hui?.hui_date || hui?.date || null;

  const attendedCount = attendees.filter(
    (a) => a.attendance_status === "attended"
  ).length;
  const apologyCount = attendees.filter(
    (a) => a.attendance_status === "apology"
  ).length;
  const absentCount = attendees.filter(
    (a) => a.attendance_status === "absent"
  ).length;

  return (
    <AppShell title="Hui Detail" eyebrow="Core Records">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Hui Record
        </p>

        {huiResult.error ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-red-400">
              Database error
            </h1>
            <pre className="mt-4 whitespace-pre-wrap text-sm text-red-400">
              {huiResult.error.message}
            </pre>
          </>
        ) : !hui ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
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
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {huiTitle}
            </h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Hui record with attendance, linked minutes, decisions, tasks, and
              file references.
            </p>
          </>
        )}
      </section>

      {hui && (
        <>
          {/* ── Hui Details ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Hui Details
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/hui"
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  Back to Hui
                </Link>
                <Link
                  href="/hui/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Hui
                </Link>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <FieldRow label="Title" darker>
                    <p className="font-medium text-[var(--foreground)]">
                      {formatValue(hui.title)}
                    </p>
                  </FieldRow>
                  <FieldRow label="Date">{formatDate(huiDate)}</FieldRow>
                  <FieldRow label="Location" darker>
                    {formatValue(hui.location)}
                  </FieldRow>
                  {hui.purpose !== undefined && (
                    <FieldRow label="Purpose">
                      <p className="whitespace-pre-wrap leading-6">
                        {formatValue(hui.purpose)}
                      </p>
                    </FieldRow>
                  )}
                  {hui.agenda !== undefined && (
                    <FieldRow label="Agenda" darker>
                      <p className="whitespace-pre-wrap leading-6">
                        {formatValue(hui.agenda)}
                      </p>
                    </FieldRow>
                  )}
                  {hui.summary !== undefined && (
                    <FieldRow label="Summary">
                      <p className="whitespace-pre-wrap leading-6">
                        {formatValue(hui.summary)}
                      </p>
                    </FieldRow>
                  )}
                  {hui.notes !== undefined && (
                    <FieldRow label="Notes" darker>
                      <p className="whitespace-pre-wrap leading-6">
                        {formatValue(hui.notes)}
                      </p>
                    </FieldRow>
                  )}
                  {hui.status !== undefined && (
                    <FieldRow label="Status">{formatValue(hui.status)}</FieldRow>
                  )}
                  <FieldRow label="Created" darker>
                    {formatDate(hui.created_at)}
                  </FieldRow>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Attendees ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Attendees
                </h2>
                {attendees.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {attendedCount} attended
                    {apologyCount > 0 && ` · ${apologyCount} apologies`}
                    {absentCount > 0 && ` · ${absentCount} absent`}
                  </p>
                )}
              </div>
              <Link
                href={`/hui/${id}/attendees/new`}
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add Attendee
              </Link>
            </div>

            {attendeesResult.error ? (
              <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
                <p className="font-semibold">Attendee query error</p>
                <pre className="mt-2 whitespace-pre-wrap">
                  {attendeesResult.error.message}
                </pre>
              </div>
            ) : attendees.length === 0 ? (
              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  No attendees recorded
                </h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Add the people who attended, sent apologies, or were invited
                  to this hui.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Role at Hui</th>
                      <th className="px-4 py-3 font-medium">Attendance</th>
                      <th className="px-4 py-3 font-medium">Organisation</th>
                      <th className="px-4 py-3 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((attendee) => (
                      <tr
                        key={attendee.id}
                        className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                      >
                        <td className="px-4 py-4">
                          {attendee.person ? (
                            <Link
                              href={`/people/${attendee.person.id}`}
                              className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                            >
                              {formatPersonName(attendee.person)}
                            </Link>
                          ) : attendee.display_name ? (
                            <span className="font-medium text-[var(--foreground)]">
                              {attendee.display_name}
                            </span>
                          ) : (
                            <span className="text-[var(--muted-foreground)]">
                              —
                            </span>
                          )}
                          {attendee.person?.role_title && (
                            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                              {attendee.person.role_title}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(attendee.attendee_role)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          <AttendeeLabel status={attendee.attendance_status} />
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(attendee.organisation_name)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(attendee.contact_notes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Linked Minutes ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Linked Minutes
                </h2>
                {linkedMinutes.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {linkedMinutes.length}{" "}
                    {linkedMinutes.length === 1 ? "record" : "records"}
                  </p>
                )}
              </div>
              <Link
                href="/minutes/new"
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              >
                Add Minutes
              </Link>
            </div>

            {minutesResult.error ? (
              <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
                <p className="font-semibold">Minutes query error</p>
                <pre className="mt-2 whitespace-pre-wrap">
                  {minutesResult.error.message}
                </pre>
              </div>
            ) : linkedMinutes.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                No minutes have been linked to this hui yet.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Approved</th>
                      <th className="px-4 py-3 font-medium">Open</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedMinutes.map((m) => (
                      <tr
                        key={m.id}
                        className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={`/minutes/${m.id}`}
                            className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                          >
                            {m.title || "Untitled minutes"}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatDate(m.minutes_date)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(m.status)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatDate(m.approved_at)}
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/minutes/${m.id}`}
                            className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Linked Decisions ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Linked Decisions
                </h2>
                {linkedDecisions.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {linkedDecisions.length}{" "}
                    {linkedDecisions.length === 1 ? "record" : "records"}
                  </p>
                )}
              </div>
              <Link
                href="/decisions/new"
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              >
                Add Decision
              </Link>
            </div>

            {decisionsResult.error ? (
              <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
                <p className="font-semibold">Decisions query error</p>
                <pre className="mt-2 whitespace-pre-wrap">
                  {decisionsResult.error.message}
                </pre>
              </div>
            ) : linkedDecisions.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                No decisions have been linked to this hui yet.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Open</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedDecisions.map((d) => (
                      <tr
                        key={d.id}
                        className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={`/decisions/${d.id}`}
                            className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                          >
                            {d.title || "Untitled decision"}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatDate(d.decision_date)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(d.status)}
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/decisions/${d.id}`}
                            className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Linked Tasks ── */}
          {(tasksResult.error || linkedTasks.length > 0) && (
            <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    Linked Tasks
                  </h2>
                  {linkedTasks.length > 0 && (
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {linkedTasks.length}{" "}
                      {linkedTasks.length === 1 ? "task" : "tasks"}
                    </p>
                  )}
                </div>
                <Link
                  href="/tasks/new"
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  Add Task
                </Link>
              </div>

              {tasksResult.error ? (
                <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
                  <p className="font-semibold">Tasks query error</p>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {tasksResult.error.message}
                  </pre>
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                  <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                    <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Task</th>
                        <th className="px-4 py-3 font-medium">Assigned To</th>
                        <th className="px-4 py-3 font-medium">Priority</th>
                        <th className="px-4 py-3 font-medium">Due</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Open</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                        >
                          <td className="px-4 py-4">
                            <Link
                              href={`/tasks/${task.id}`}
                              className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                            >
                              {task.title || "Untitled task"}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {task.assigned_to_id ? (
                              <Link
                                href={`/people/${task.assigned_to_id}`}
                                className="text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                              >
                                {task.assigned_to?.full_name || "Unknown"}
                              </Link>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatValue(task.priority)}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatDate(task.due_date)}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatValue(task.status)}
                          </td>
                          <td className="px-4 py-4">
                            <Link
                              href={`/tasks/${task.id}`}
                              className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ── File References ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  File References
                </h2>
                {fileRefs.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {fileRefs.length}{" "}
                    {fileRefs.length === 1 ? "file" : "files"}
                  </p>
                )}
              </div>
              <Link
                href={`/records/hui/${id}/files/new`}
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add File Reference
              </Link>
            </div>

            {filesResult.error ? (
              <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
                <p className="font-semibold">Files query error</p>
                <pre className="mt-2 whitespace-pre-wrap">
                  {filesResult.error.message}
                </pre>
              </div>
            ) : fileRefs.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                No file references yet. Add agenda PDFs, hui packs, or other
                evidence documents.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">File</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Evidence Category</th>
                      <th className="px-4 py-3 font-medium">Sensitivity</th>
                      <th className="px-4 py-3 font-medium">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileRefs.map((f) => (
                      <tr
                        key={f.id}
                        className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                      >
                        <td className="px-4 py-4">
                          <p className="font-medium text-[var(--foreground)]">
                            {f.file_name || "Unnamed file"}
                          </p>
                          {f.file_description && (
                            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                              {f.file_description}
                            </p>
                          )}
                          {f.version_label && (
                            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                              {f.version_label}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(f.document_type)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(f.evidence_category)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(f.sensitivity_level)}
                        </td>
                        <td className="px-4 py-4">
                          {f.source_url || f.public_url ? (
                            <a
                              href={f.source_url ?? f.public_url ?? ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                            >
                              Open
                            </a>
                          ) : (
                            <span className="text-[var(--muted-foreground)]">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Linked Records ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Linked Records
                </h2>
                {allLinks.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {allLinks.length} linked{" "}
                    {allLinks.length === 1 ? "record" : "records"}
                  </p>
                )}
              </div>
            </div>

            {allLinks.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                No cross-record links yet. Links to whenua, marae, governance
                records, and other modules will appear here.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Relationship</th>
                      <th className="px-4 py-3 font-medium">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allLinks.map((link) => {
                      const isSource =
                        link.source_record_type === "hui" &&
                        link.source_record_id === id;
                      const linkedType = isSource
                        ? link.target_record_type
                        : link.source_record_type;
                      const linkedId = isSource
                        ? link.target_record_id
                        : link.source_record_id;
                      return (
                        <tr
                          key={link.id}
                          className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                        >
                          <td className="px-4 py-4 font-medium text-[var(--foreground)]">
                            {link.title || `${linkedType} record`}
                            {link.summary && (
                              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                                {link.summary}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {linkedType}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatValue(link.relationship_type)}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatDate(link.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}
