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

type DecisionRow = {
  id: string;
  title?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
  status?: string | null;
};

type TaskRow = {
  id: string;
  title?: string | null;
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
};

type FileRow = {
  id: string;
  file_name?: string | null;
  document_type?: string | null;
  evidence_category?: string | null;
  record_type?: string | null;
  created_at?: string | null;
};

type GovernanceChainPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const YEAR_OPTIONS = ["2021", "2022", "2023", "2024", "2025", "2026"];

export default async function GovernanceChainReportPage({ searchParams }: GovernanceChainPageProps) {
  const sp = await searchParams;
  const filterYear = typeof sp.year === "string" ? sp.year.trim() : "";

  const yearStart = filterYear ? `${filterYear}-01-01` : null;
  const yearEnd = filterYear ? `${filterYear}-12-31` : null;

  const [
    huiCount,
    minutesCount,
    decisionsCount,
    tasksCount,
    filesCount,
    linksCount,
    recentHuiResult,
    recentDecisionsResult,
    openTasksResult,
    recentFilesResult,
  ] = await Promise.all([
    supabase.from("hui").select("*", { count: "exact", head: true }),
    supabase.from("minutes").select("*", { count: "exact", head: true }),
    supabase.from("decisions").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }),
    supabase.from("record_files").select("*", { count: "exact", head: true }),
    supabase.from("record_links").select("*", { count: "exact", head: true }),
    (() => {
      let q = supabase
        .from("hui")
        .select("id, title, hui_date, date, location, status")
        .order("hui_date", { ascending: false })
        .limit(20);
      if (yearStart) q = q.gte("hui_date", yearStart);
      if (yearEnd) q = q.lte("hui_date", yearEnd);
      return q;
    })(),
    (() => {
      let q = supabase
        .from("decisions")
        .select("id, title, decision_date, effective_date, status")
        .order("decision_date", { ascending: false })
        .limit(20);
      if (yearStart) q = q.gte("decision_date", yearStart);
      if (yearEnd) q = q.lte("decision_date", yearEnd);
      return q;
    })(),
    supabase
      .from("tasks")
      .select("id, title, status, priority, due_date")
      .not("status", "in", '("done","completed","closed")')
      .order("due_date", { ascending: true })
      .limit(10),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, evidence_category, record_type, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const recentHui = (recentHuiResult.data ?? []) as HuiRow[];
  const recentDecisions = (recentDecisionsResult.data ?? []) as DecisionRow[];
  const openTasks = (openTasksResult.data ?? []) as TaskRow[];
  const recentFiles = (recentFilesResult.data ?? []) as FileRow[];

  const generatedAt = new Date().toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell title="Governance Chain" eyebrow="Reports">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 print:border-none print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Governance Report
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Governance Chain Report
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Generated {generatedAt}
              {filterYear ? ` · Filtered to ${filterYear}` : " · All years"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <form method="GET" action="/reports/governance-chain" className="flex items-center gap-2">
              <label htmlFor="year" className="text-xs font-medium text-[var(--muted-foreground)]">
                Year
              </label>
              <select
                id="year"
                name="year"
                defaultValue={filterYear}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="">All years</option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-[var(--foreground)] px-3 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Filter
              </button>
              {filterYear && (
                <Link
                  href="/reports/governance-chain"
                  className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  Clear
                </Link>
              )}
            </form>
            <Link
              href="/reports"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              All Reports
            </Link>
            <PrintButton />
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--muted-foreground)]">
          The governance chain connects hui through minutes, decisions, tasks,
          and evidence references — showing how governance decisions are made,
          recorded, actioned, and proven. This report is a summary of the full
          chain as it currently exists in the system.
        </p>
      </section>

      {/* ── Chain Stats ── */}
      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Chain Summary
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <ReportStatCard label="Hui" value={huiCount.count ?? 0} subtext="meetings" />
          <ReportStatCard label="Minutes" value={minutesCount.count ?? 0} subtext="meeting records" />
          <ReportStatCard label="Decisions" value={decisionsCount.count ?? 0} subtext="formal decisions" />
          <ReportStatCard label="Tasks" value={tasksCount.count ?? 0} subtext="actions" />
          <ReportStatCard label="File Refs" value={filesCount.count ?? 0} subtext="evidence references" />
          <ReportStatCard label="Record Links" value={linksCount.count ?? 0} subtext="cross-record links" />
        </div>
      </section>

      {/* ── What the chain proves ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          What This Chain Proves
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Governance meetings were held and recorded",
            "Formal minutes were kept",
            "Decisions were formally recorded",
            "Actions and tasks arose from decisions",
            "Evidence references exist for key records",
            "Cross-record links demonstrate a connected governance system",
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

      {/* ── Recent Hui ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Recent Hui
          </h2>
          <Link
            href="/hui"
            className="text-xs font-medium text-[var(--muted-foreground)] underline-offset-4 hover:underline print:hidden"
          >
            View all →
          </Link>
        </div>
        {recentHuiResult.error ? (
          <p className="mt-4 text-sm text-red-400">{recentHuiResult.error.message}</p>
        ) : recentHui.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">No hui records yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentHui.map((h) => (
                  <tr key={h.id} className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]">
                    <td className="px-4 py-4">
                      <Link href={`/hui/${h.id}`} className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline print:no-underline">
                        {h.title || "Untitled hui"}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatDate(h.hui_date || h.date)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(h.location)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(h.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Recent Decisions ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Recent Decisions
          </h2>
          <Link
            href="/decisions"
            className="text-xs font-medium text-[var(--muted-foreground)] underline-offset-4 hover:underline print:hidden"
          >
            View all →
          </Link>
        </div>
        {recentDecisionsResult.error ? (
          <p className="mt-4 text-sm text-red-400">{recentDecisionsResult.error.message}</p>
        ) : recentDecisions.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">No decision records yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Decision</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDecisions.map((d) => (
                  <tr key={d.id} className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]">
                    <td className="px-4 py-4">
                      <Link href={`/decisions/${d.id}`} className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline">
                        {d.title || "Untitled decision"}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatDate(d.decision_date || d.effective_date)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(d.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Open Tasks ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Open Tasks
          </h2>
          <Link
            href="/tasks"
            className="text-xs font-medium text-[var(--muted-foreground)] underline-offset-4 hover:underline print:hidden"
          >
            View all →
          </Link>
        </div>
        {openTasksResult.error ? (
          <p className="mt-4 text-sm text-red-400">{openTasksResult.error.message}</p>
        ) : openTasks.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">No open tasks.</p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {openTasks.map((t) => (
                  <tr key={t.id} className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]">
                    <td className="px-4 py-4">
                      <Link href={`/tasks/${t.id}`} className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline">
                        {t.title || "Untitled task"}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(t.priority)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(t.status)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatDate(t.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Recent Evidence ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Recent Evidence References
          </h2>
          <Link
            href="/library/files"
            className="text-xs font-medium text-[var(--muted-foreground)] underline-offset-4 hover:underline print:hidden"
          >
            Full index →
          </Link>
        </div>
        {recentFilesResult.error ? (
          <p className="mt-4 text-sm text-red-400">{recentFilesResult.error.message}</p>
        ) : recentFiles.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            No file or evidence references yet. Add references from record detail pages.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Doc Type</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Record Type</th>
                  <th className="px-4 py-3 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {recentFiles.map((f) => (
                  <tr key={f.id} className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]">
                    <td className="px-4 py-4 font-medium text-[var(--foreground)]">
                      {f.file_name || "Unnamed file"}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(f.document_type)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(f.evidence_category)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {f.record_type ? f.record_type.replace(/_/g, " ") : "—"}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatDate(f.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
