import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ReportStatCard from "@/components/reports/ReportStatCard";
import PrintButton from "@/components/reports/PrintButton";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type HuiRow = {
  id: string;
  title?: string | null;
  hui_date?: string | null;
  date?: string | null;
  location?: string | null;
  status?: string | null;
};

type AttendeeRow = {
  id: string;
  hui_id: string;
  attendance_status: string;
  attendee_role?: string | null;
  display_name?: string | null;
  person_id?: string | null;
};

type AttendeeWithHui = AttendeeRow & {
  hui: { title?: string | null; hui_date?: string | null; date?: string | null } | null;
};

export default async function HuiParticipationReportPage() {
  const [huiCount, attendeeResult, recentHuiResult] = await Promise.all([
    supabase.from("hui").select("*", { count: "exact", head: true }),
    supabase
      .from("hui_attendees")
      .select(
        "id, hui_id, attendance_status, attendee_role, display_name, person_id, hui:hui_id(title, hui_date, date)"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("hui")
      .select("id, title, hui_date, date, location, status")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const attendees = (attendeeResult.data ?? []) as unknown as AttendeeWithHui[];
  const recentHui = (recentHuiResult.data ?? []) as HuiRow[];

  const attended = attendees.filter((a) => a.attendance_status === "attended").length;
  const apologies = attendees.filter((a) => a.attendance_status === "apology").length;
  const invited = attendees.filter((a) => a.attendance_status === "invited").length;
  const absent = attendees.filter((a) => a.attendance_status === "absent").length;

  const chairs = attendees.filter((a) => a.attendee_role === "chair").length;
  const recorders = attendees.filter((a) => a.attendee_role === "recorder").length;
  const serviceProviders = attendees.filter((a) => a.attendee_role === "service_provider").length;
  const linkedToPeople = attendees.filter((a) => a.person_id).length;

  const generatedAt = new Date().toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const attendeesByHui: Record<string, AttendeeWithHui[]> = {};
  for (const a of attendees) {
    if (!attendeesByHui[a.hui_id]) attendeesByHui[a.hui_id] = [];
    attendeesByHui[a.hui_id].push(a);
  }

  return (
    <AppShell title="Hui Participation" eyebrow="Reports">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 print:border-none print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Governance Report
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Hui Participation Report
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Generated {generatedAt}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/reports"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)] print:hidden"
            >
              All Reports
            </Link>
            <PrintButton />
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--muted-foreground)]">
          This report shows attendance and participation evidence across all hui.
          It demonstrates community engagement, governance participation, and
          quorum evidence — important for funders, regulators, and governance
          accountability.
        </p>
      </section>

      {/* ── Stats ── */}
      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Participation Summary
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <ReportStatCard label="Total Hui" value={huiCount.count ?? 0} subtext="meetings recorded" />
          <ReportStatCard label="Attendance Records" value={attendees.length} subtext="total entries" />
          <ReportStatCard label="Attended" value={attended} subtext="confirmed present" />
          <ReportStatCard label="Apologies" value={apologies} subtext="recorded apologies" />
          <ReportStatCard label="Invited" value={invited} subtext="invitations sent" />
          <ReportStatCard label="Absent" value={absent} subtext="no apology recorded" />
          <ReportStatCard label="Linked to People" value={linkedToPeople} subtext="registered persons" />
          <ReportStatCard
            label="Role Counts"
            value={`${chairs} chairs · ${recorders} recorders`}
            subtext={serviceProviders > 0 ? `${serviceProviders} service providers` : undefined}
          />
        </div>
      </section>

      {attendeeResult.error && (
        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          <p className="font-semibold">Attendees query error</p>
          <pre className="mt-2 whitespace-pre-wrap">{attendeeResult.error.message}</pre>
        </div>
      )}

      {/* ── What this proves ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          What This Report Proves
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Hui were attended by community members",
            "Attendance was formally recorded",
            "Governance roles (chair, recorder) were assigned",
            "External service providers participated where recorded",
            "Apologies were received and registered",
            "Participants are linked to the people register",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <p className="text-sm text-[var(--foreground)]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent Hui with Attendance ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Hui Attendance Breakdown
          </h2>
          <Link
            href="/hui"
            className="text-xs font-medium text-[var(--muted-foreground)] underline-offset-4 hover:underline print:hidden"
          >
            View all hui →
          </Link>
        </div>

        {recentHui.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">No hui records yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {recentHui.map((h) => {
              const hAttendees = attendeesByHui[h.id] ?? [];
              const hAttended = hAttendees.filter((a) => a.attendance_status === "attended").length;
              const hApologies = hAttendees.filter((a) => a.attendance_status === "apology").length;
              const hAbsent = hAttendees.filter((a) => a.attendance_status === "absent").length;

              return (
                <div
                  key={h.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/hui/${h.id}`}
                        className="font-semibold text-[var(--foreground)] underline-offset-4 hover:underline"
                      >
                        {h.title || "Untitled hui"}
                      </Link>
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        {formatDate(h.hui_date || h.date)}
                        {h.location ? ` · ${h.location}` : ""}
                        {h.status ? ` · ${h.status}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-emerald-950 px-2.5 py-1 text-emerald-400">
                        {hAttended} attended
                      </span>
                      {hApologies > 0 && (
                        <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted-foreground)]">
                          {hApologies} apologies
                        </span>
                      )}
                      {hAbsent > 0 && (
                        <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted-foreground)]">
                          {hAbsent} absent
                        </span>
                      )}
                      {hAttendees.length === 0 && (
                        <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted-foreground)]">
                          No attendance recorded
                        </span>
                      )}
                    </div>
                  </div>

                  {hAttendees.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {hAttendees.slice(0, 12).map((a) => (
                        <span
                          key={a.id}
                          className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]"
                        >
                          {a.display_name || "Unnamed"}
                          {a.attendee_role ? ` (${a.attendee_role})` : ""}
                        </span>
                      ))}
                      {hAttendees.length > 12 && (
                        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
                          +{hAttendees.length - 12} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Full Attendance Table ── */}
      {attendees.length > 0 && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Full Attendance Register
          </h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Attendee</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Hui</th>
                  <th className="px-4 py-3 font-medium">Hui Date</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr key={a.id} className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]">
                    <td className="px-4 py-4 font-medium text-[var(--foreground)]">
                      {a.display_name || (a.person_id ? "Person record" : "Unknown")}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(a.attendance_status)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(a.attendee_role)}
                    </td>
                    <td className="px-4 py-4">
                      {a.hui ? (
                        <Link href={`/hui/${a.hui_id}`} className="text-[var(--foreground)] underline-offset-4 hover:underline">
                          {a.hui.title || "Untitled hui"}
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {a.hui ? formatDate(a.hui.hui_date || a.hui.date) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </AppShell>
  );
}
