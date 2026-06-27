import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

export default async function FinancePage() {
  const [
    whenuaResult,
    maraeResult,
    filesResult,
    documentsResult,
    openTasksResult,
    governanceResult,
    decisionsResult,
  ] = await Promise.all([
    supabase.from("whenua_records").select("*", { count: "exact", head: true }),
    supabase.from("marae_records").select("*", { count: "exact", head: true }),
    supabase.from("record_files").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase
      .from("tasks")
      .select("id, title, status, priority")
      .in("status", ["open", "pending", "in_progress", "todo", "not_started"])
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("governance_records").select("*", { count: "exact", head: true }),
    supabase.from("decisions").select("*", { count: "exact", head: true }),
  ]);

  const whenuaCount = whenuaResult.count ?? 0;
  const maraeCount = maraeResult.count ?? 0;
  const filesCount = filesResult.count ?? 0;
  const documentsCount = documentsResult.count ?? 0;
  const governanceCount = governanceResult.count ?? 0;
  const decisionsCount = decisionsResult.count ?? 0;
  const openTasks = (openTasksResult.data ?? []) as Array<{
    id: string;
    title: string | null;
    status: string | null;
    priority: string | null;
  }>;

  const readinessItems = [
    { label: "Whenua blocks on record", value: whenuaCount, href: "/whenua", done: whenuaCount > 0 },
    { label: "Marae profiles on record", value: maraeCount, href: "/marae", done: maraeCount > 0 },
    { label: "Governance instruments filed", value: governanceCount, href: "/governance", done: governanceCount > 0 },
    { label: "Formal decisions recorded", value: decisionsCount, href: "/decisions", done: decisionsCount > 0 },
    { label: "Evidence & file references", value: filesCount, href: "/library/evidence", done: filesCount > 0 },
    { label: "Supporting documents filed", value: documentsCount, href: "/documents", done: documentsCount > 0 },
  ];

  const readinessScore = readinessItems.filter((i) => i.done).length;
  const readinessPct = Math.round((readinessScore / readinessItems.length) * 100);

  const futureModules = [
    "Budgets & financial periods",
    "Income & expense tracking",
    "Funding applications & grants",
    "Funder contact register",
    "Contracts & invoices",
    "Asset register with values & condition",
    "Project budgets & milestones",
    "Finance approvals & authorisations",
    "Financial reporting periods",
    "Audit-ready financial documents",
  ];

  return (
    <AppShell title="Finance & Funding" eyebrow="Intelligence & Outcomes">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Intelligence & Outcomes
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Finance & Funding Foundation
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
          Funding readiness intelligence built from existing governance, land, people, and evidence
          records. This is the foundation layer — showing what evidence currently exists and what
          gaps remain before a funding application or financial audit.
          Full budget and income tracking will be available once a finance schema is approved.
        </p>
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Current scope
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            This page uses existing records — whenua, marae, governance, decisions, documents,
            and evidence — to calculate funding readiness. It does not yet have its own finance
            tables for budgets, income, expenses, or grants. That schema pass is planned for a
            future release once the governance and evidence base is established.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/reports/funding-readiness"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Funding Readiness Report
          </Link>
          <Link
            href="/library/evidence"
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Evidence Archive
          </Link>
          <Link
            href="/reports"
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            All Reports
          </Link>
        </div>
      </section>

      {/* ── Funding Readiness Indicator ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Funding Readiness
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Evidence completeness across key funding indicators.
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold text-[var(--foreground)]">
              {readinessPct}
              <span className="text-lg font-normal text-[var(--muted-foreground)]">%</span>
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {readinessScore} of {readinessItems.length} indicators
            </p>
          </div>
        </div>

        {/* Progress strip */}
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${readinessPct}%` }}
          />
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {readinessItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm transition hover:border-[var(--accent)]"
            >
              <span className="text-[var(--muted-foreground)]">{item.label}</span>
              <span
                className={`flex items-center gap-1.5 font-semibold ${
                  item.done ? "text-[var(--accent)]" : "text-[var(--muted-foreground)]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.done ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                  }`}
                />
                {item.done ? item.value : "0"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Asset Intelligence ── */}
      <section className="mt-6 grid gap-5 md:grid-cols-2">
        {/* Whenua */}
        <Link
          href="/whenua"
          className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Whenua Assets
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {whenuaCount}
            <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">
              {whenuaCount === 1 ? "block" : "blocks"} on record
            </span>
          </p>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Land records, legal descriptions, boundary data, and whenua
            governance instruments. Each block can carry evidence references,
            survey documents, and development opportunity notes.
          </p>
          <p className="mt-4 text-xs font-medium text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
            Open Whenua register →
          </p>
        </Link>

        {/* Marae */}
        <Link
          href="/marae"
          className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Marae & Facilities
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {maraeCount}
            <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">
              {maraeCount === 1 ? "profile" : "profiles"} on record
            </span>
          </p>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Marae profiles, facilities, development needs, and hui history.
            Marae records anchor asset intelligence, infrastructure investment
            cases, and community-use evidence for funders.
          </p>
          <p className="mt-4 text-xs font-medium text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
            Open Marae register →
          </p>
        </Link>

        {/* Evidence */}
        <Link
          href="/library/evidence"
          className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Evidence & File References
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {filesCount}
            <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">
              {filesCount === 1 ? "reference" : "references"} archived
            </span>
          </p>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Evidence references attached to governance records, decisions, and
            whenua. The completeness of your evidence archive is the single
            biggest driver of funding readiness.
          </p>
          <p className="mt-4 text-xs font-medium text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
            Open Evidence archive →
          </p>
        </Link>

        {/* Documents */}
        <Link
          href="/documents"
          className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Document Archive
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {documentsCount}
            <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">
              {documentsCount === 1 ? "document" : "documents"} filed
            </span>
          </p>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Deeds, reports, contracts, plans, legal correspondence, and
            financial documents. The document archive is what auditors review
            and what funders use to verify governance capability.
          </p>
          <p className="mt-4 text-xs font-medium text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
            Open Documents →
          </p>
        </Link>
      </section>

      {/* ── Open Tasks ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Open Actions
            </h2>
            <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
              Tasks open across all governance areas — including finance,
              funding, and delivery actions.
            </p>
          </div>
          <Link
            href="/tasks"
            className="shrink-0 text-xs font-medium text-[var(--muted-foreground)] transition hover:text-[var(--accent)]"
          >
            All tasks →
          </Link>
        </div>

        {openTasks.length === 0 ? (
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 text-center">
            <p className="text-sm font-medium text-[var(--foreground)]">
              No open tasks
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Tasks assigned from decisions will appear here.
            </p>
            <Link
              href="/tasks/new"
              className="mt-4 inline-block rounded-xl bg-[var(--foreground)] px-4 py-2 text-xs font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Task
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-[var(--border)]">
            {openTasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center justify-between gap-4 py-3 text-sm transition first:pt-0 last:pb-0 hover:opacity-75"
              >
                <span className="truncate font-medium text-[var(--foreground)]">
                  {task.title || "Untitled task"}
                </span>
                <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)]">
                  {task.priority || task.status || "open"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Reports for Funders ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Reports for Funders & Auditors
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          These reports are ready to print or share with funders, boards, and
          service providers.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Funding Readiness",
              href: "/reports/funding-readiness",
              desc: "Data completeness indicators across all governance modules.",
            },
            {
              title: "Governance Chain",
              href: "/reports/governance-chain",
              desc: "Full chain from hui through minutes, decisions, and tasks.",
            },
            {
              title: "Evidence & Files",
              href: "/reports/evidence-files",
              desc: "Audit of all file references and evidence readiness.",
            },
            {
              title: "Marae Governance",
              href: "/reports/marae-governance",
              desc: "Trustee structure, term history, and AGM records.",
            },
            {
              title: "Document Register",
              href: "/reports/document-register",
              desc: "Printable register of all documents and files.",
            },
            {
              title: "Hui Participation",
              href: "/reports/hui-participation",
              desc: "Attendance and participation evidence across all hui.",
            },
          ].map((report) => (
            <Link
              key={report.title}
              href={report.href}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {report.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                {report.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Future Finance Tracking ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Full Finance Tracking — Next Phase
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              The following capabilities require a dedicated finance schema
              pass. They are scoped and ready to implement once approved.
            </p>
            <div className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-[var(--muted-foreground)] sm:grid-cols-2">
              {futureModules.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
