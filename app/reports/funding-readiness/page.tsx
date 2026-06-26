import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PrintButton from "@/components/reports/PrintButton";
import { supabase } from "@/lib/supabaseClient";

type IndicatorStatus = "present" | "missing" | "partial";

type Indicator = {
  label: string;
  description: string;
  status: IndicatorStatus;
  count: number;
  href?: string;
  hrefLabel?: string;
  importance: "high" | "medium" | "supporting";
};

function StatusDot({ status }: { status: IndicatorStatus }) {
  const colours: Record<IndicatorStatus, string> = {
    present: "bg-emerald-500",
    missing: "bg-red-500",
    partial: "bg-amber-500",
  };
  return (
    <span
      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${colours[status]}`}
    />
  );
}

function StatusLabel({ status }: { status: IndicatorStatus }) {
  const labels: Record<IndicatorStatus, string> = {
    present: "Evidence present",
    missing: "Evidence missing",
    partial: "Needs more data",
  };
  const colours: Record<IndicatorStatus, string> = {
    present: "text-emerald-400",
    missing: "text-red-400",
    partial: "text-amber-400",
  };
  return (
    <span className={`text-xs font-medium ${colours[status]}`}>
      {labels[status]}
    </span>
  );
}

export default async function FundingReadinessPage() {
  const [
    people,
    maraeRecords,
    whenua,
    governanceRecords,
    hui,
    minutes,
    decisions,
    tasks,
    documents,
    recordFiles,
    roleTerms,
    attendees,
  ] = await Promise.all([
    supabase.from("people").select("*", { count: "exact", head: true }),
    supabase.from("marae_records").select("*", { count: "exact", head: true }),
    supabase.from("whenua").select("*", { count: "exact", head: true }),
    supabase.from("governance_records").select("*", { count: "exact", head: true }),
    supabase.from("hui").select("*", { count: "exact", head: true }),
    supabase.from("minutes").select("*", { count: "exact", head: true }),
    supabase.from("decisions").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase.from("record_files").select("*", { count: "exact", head: true }),
    supabase.from("governance_role_terms").select("*", { count: "exact", head: true }),
    supabase.from("hui_attendees").select("*", { count: "exact", head: true }),
  ]);

  function indicator(count: number | null): IndicatorStatus {
    if (!count) return "missing";
    if (count >= 3) return "present";
    return "partial";
  }

  const indicators: Indicator[] = [
    {
      label: "People Register",
      description: "Key personnel, trustees, and community members registered in the people module.",
      status: indicator(people.count),
      count: people.count ?? 0,
      href: "/people",
      hrefLabel: "View People",
      importance: "high",
    },
    {
      label: "Marae Records",
      description: "Marae profile records establishing the organisational entity.",
      status: indicator(maraeRecords.count),
      count: maraeRecords.count ?? 0,
      href: "/marae",
      hrefLabel: "View Marae",
      importance: "high",
    },
    {
      label: "Whenua Records",
      description: "Land and property records establishing land connection and asset base.",
      status: indicator(whenua.count),
      count: whenua.count ?? 0,
      href: "/whenua",
      hrefLabel: "View Whenua",
      importance: "high",
    },
    {
      label: "Governance Records",
      description: "Formal governance records — mandates, constitution references, authority records.",
      status: indicator(governanceRecords.count),
      count: governanceRecords.count ?? 0,
      href: "/governance",
      hrefLabel: "View Governance",
      importance: "high",
    },
    {
      label: "Trustee / Role Terms",
      description: "Formal governance role terms proving who holds authority and since when.",
      status: indicator(roleTerms.count),
      count: roleTerms.count ?? 0,
      href: "/reports/marae-governance",
      hrefLabel: "View Governance Report",
      importance: "high",
    },
    {
      label: "Hui Records",
      description: "Meeting records proving the governance body meets regularly.",
      status: indicator(hui.count),
      count: hui.count ?? 0,
      href: "/hui",
      hrefLabel: "View Hui",
      importance: "high",
    },
    {
      label: "Hui Attendance Evidence",
      description: "Attendance records across hui proving community participation and quorum.",
      status: indicator(attendees.count),
      count: attendees.count ?? 0,
      href: "/reports/hui-participation",
      hrefLabel: "View Participation Report",
      importance: "high",
    },
    {
      label: "Minutes",
      description: "Meeting minutes proving formal record-keeping of governance decisions.",
      status: indicator(minutes.count),
      count: minutes.count ?? 0,
      href: "/minutes",
      hrefLabel: "View Minutes",
      importance: "medium",
    },
    {
      label: "Formal Decisions",
      description: "Decision records establishing the formal decision-making record.",
      status: indicator(decisions.count),
      count: decisions.count ?? 0,
      href: "/decisions",
      hrefLabel: "View Decisions",
      importance: "medium",
    },
    {
      label: "Tasks and Actions",
      description: "Task records proving decisions are followed through with actions.",
      status: indicator(tasks.count),
      count: tasks.count ?? 0,
      href: "/tasks",
      hrefLabel: "View Tasks",
      importance: "medium",
    },
    {
      label: "Documents",
      description: "Formal documents — trust deeds, constitutions, agreements, reports.",
      status: indicator(documents.count),
      count: documents.count ?? 0,
      href: "/documents",
      hrefLabel: "View Documents",
      importance: "medium",
    },
    {
      label: "File and Evidence References",
      description: "File URLs and evidence references linked to records — proving documentation exists.",
      status: indicator(recordFiles.count),
      count: recordFiles.count ?? 0,
      href: "/library/evidence",
      hrefLabel: "View Evidence Archive",
      importance: "supporting",
    },
  ];

  const highPriority = indicators.filter((i) => i.importance === "high");
  const medium = indicators.filter((i) => i.importance === "medium");
  const supporting = indicators.filter((i) => i.importance === "supporting");

  const presentCount = indicators.filter((i) => i.status === "present").length;
  const partialCount = indicators.filter((i) => i.status === "partial").length;
  const missingCount = indicators.filter((i) => i.status === "missing").length;

  const overallStatus =
    missingCount === 0 && partialCount <= 2
      ? "Strong"
      : missingCount <= 2
      ? "Building"
      : "Early Stage";

  const generatedAt = new Date().toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell title="Funding Readiness" eyebrow="Reports">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 print:border-none print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Governance Report
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Funding Readiness Snapshot
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
          This snapshot shows whether the organisation has the evidence base
          needed for funding applications — based on data currently recorded in
          the system. It does not claim funding eligibility or guarantee
          approval. It is a data completeness indicator only.
        </p>
      </section>

      {/* ── Overall ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Overall Readiness
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Status
            </p>
            <p
              className={`mt-1 text-2xl font-semibold ${
                overallStatus === "Strong"
                  ? "text-emerald-400"
                  : overallStatus === "Building"
                  ? "text-amber-400"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              {overallStatus}
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-semibold tabular-nums text-emerald-400">
                {presentCount}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">Present</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold tabular-nums text-amber-400">
                {partialCount}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">Partial</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold tabular-nums text-red-400">
                {missingCount}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">Missing</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          "Present" = 3 or more records. "Needs more data" = 1–2 records. "Missing" = no records yet.
          These thresholds are indicative only.
        </p>
      </section>

      {/* ── High Priority Indicators ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Core Governance Evidence
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Most funders require this evidence to be present.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {highPriority.map((ind) => (
            <div
              key={ind.label}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
            >
              <StatusDot status={ind.status} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-[var(--foreground)]">{ind.label}</p>
                  <div className="flex items-center gap-2">
                    <StatusLabel status={ind.status} />
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs tabular-nums text-[var(--muted-foreground)]">
                      {ind.count}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                  {ind.description}
                </p>
                {ind.href && ind.status !== "present" && (
                  <Link
                    href={ind.href}
                    className="mt-2 block text-xs font-medium text-[var(--foreground)] underline-offset-4 hover:underline print:hidden"
                  >
                    {ind.hrefLabel} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Medium Priority ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Governance Process Evidence
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Supports funding applications — shows active governance process.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {medium.map((ind) => (
            <div
              key={ind.label}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
            >
              <StatusDot status={ind.status} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-[var(--foreground)]">{ind.label}</p>
                  <div className="flex items-center gap-2">
                    <StatusLabel status={ind.status} />
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs tabular-nums text-[var(--muted-foreground)]">
                      {ind.count}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                  {ind.description}
                </p>
                {ind.href && ind.status !== "present" && (
                  <Link
                    href={ind.href}
                    className="mt-2 block text-xs font-medium text-[var(--foreground)] underline-offset-4 hover:underline print:hidden"
                  >
                    {ind.hrefLabel} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Supporting ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Supporting Evidence
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Potentially useful for funding packs — strengthens the evidence base.
        </p>
        <div className="mt-5 grid gap-3">
          {supporting.map((ind) => (
            <div
              key={ind.label}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
            >
              <StatusDot status={ind.status} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-[var(--foreground)]">{ind.label}</p>
                  <div className="flex items-center gap-2">
                    <StatusLabel status={ind.status} />
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs tabular-nums text-[var(--muted-foreground)]">
                      {ind.count}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                  {ind.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-medium text-[var(--foreground)]">
          Important Note
        </h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          This snapshot is a data completeness indicator only. It does not
          claim funding eligibility, guarantee funder approval, or represent
          legal or financial advice. Funding readiness depends on the specific
          funder, programme requirements, and many factors outside this system.
          Use this report to identify data gaps and improve the evidence base.
        </p>
      </section>
    </AppShell>
  );
}
