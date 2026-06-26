import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  const [
    peopleRes, whenuaRes, maraeRes, huiRes, minutesRes, decisionsRes,
    tasksRes, documentsRes, filesRes, governanceRes, whakapapaRes,
    panuiRes, activityRes,
    openTasksRes, recentDecisionsRes,
  ] = await Promise.all([
    supabase.from("people").select("*", { count: "exact", head: true }),
    supabase.from("whenua_records").select("*", { count: "exact", head: true }),
    supabase.from("marae_records").select("*", { count: "exact", head: true }),
    supabase.from("hui").select("*", { count: "exact", head: true }),
    supabase.from("minutes").select("*", { count: "exact", head: true }),
    supabase.from("decisions").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase.from("record_files").select("*", { count: "exact", head: true }),
    supabase.from("governance_records").select("*", { count: "exact", head: true }),
    supabase.from("whakapapa_relationships").select("*", { count: "exact", head: true }),
    supabase.from("panui").select("*", { count: "exact", head: true }),
    supabase.from("activity_log").select("*", { count: "exact", head: true }),
    supabase
      .from("tasks")
      .select("id, title, status, priority")
      .in("status", ["open", "pending", "in_progress", "todo", "not_started"])
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("decisions")
      .select("id, title, status, decision_date")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const counts = {
    people: peopleRes.count ?? 0,
    whenua: whenuaRes.count ?? 0,
    marae: maraeRes.count ?? 0,
    hui: huiRes.count ?? 0,
    minutes: minutesRes.count ?? 0,
    decisions: decisionsRes.count ?? 0,
    tasks: tasksRes.count ?? 0,
    documents: documentsRes.count ?? 0,
    files: filesRes.count ?? 0,
    governance: governanceRes.count ?? 0,
    whakapapa: whakapapaRes.count ?? 0,
    panui: panuiRes.count ?? 0,
    activity: activityRes.count ?? 0,
  };

  const openTasks = (openTasksRes.data ?? []) as Array<{
    id: string; title: string | null; status: string | null; priority: string | null;
  }>;
  const recentDecisions = (recentDecisionsRes.data ?? []) as Array<{
    id: string; title: string | null; status: string | null; decision_date: string | null;
  }>;

  const totalRecords = Object.values(counts).reduce((s, n) => s + n, 0);

  const readinessChecks = [
    { label: "People", done: counts.people > 0 },
    { label: "Whenua", done: counts.whenua > 0 },
    { label: "Marae", done: counts.marae > 0 },
    { label: "Governance instruments", done: counts.governance > 0 },
    { label: "Hui held", done: counts.hui > 0 },
    { label: "Minutes filed", done: counts.minutes > 0 },
    { label: "Decisions recorded", done: counts.decisions > 0 },
    { label: "Evidence archived", done: counts.files > 0 },
  ];
  const readinessDone = readinessChecks.filter((c) => c.done).length;
  const readinessPct = Math.round((readinessDone / readinessChecks.length) * 100);

  function Stat({
    label,
    value,
    href,
    accent = false,
  }: {
    label: string;
    value: number;
    href: string;
    accent?: boolean;
  }) {
    return (
      <Link
        href={href}
        className="group flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
      >
        <p className="text-xs font-medium text-[var(--muted-foreground)]">
          {label}
        </p>
        <p
          className={`mt-3 text-3xl font-semibold tracking-tight ${
            accent ? "text-[var(--accent)]" : "text-[var(--foreground)]"
          }`}
        >
          {value}
        </p>
        <p className="mt-2 text-[10px] font-medium text-[var(--muted-foreground)] opacity-0 transition group-hover:opacity-100">
          Open register →
        </p>
      </Link>
    );
  }

  return (
    <AppShell title="Dashboard" eyebrow="Tangata">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent)]" />
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12 lg:p-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              Governance OS
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Tangata
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--foreground)]">
              Linked Māori governance, whakapapa, whenua, marae, finance,
              evidence, reporting, and economic development — in one operating
              system.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
              Governance chains link hui → minutes → decisions → tasks. Every
              record carries evidence references. Reports turn data into
              accountability evidence ready for funders and auditors.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/hui/new"
                className="rounded-xl bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                New Hui
              </Link>
              <Link
                href="/search"
                className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Search Registers
              </Link>
              <Link
                href="/finance"
                className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Finance & Assets
              </Link>
              <Link
                href="/reports"
                className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Reports
              </Link>
            </div>
          </div>

          {/* Registry summary box */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              Registry Summary
            </p>
            <dl className="mt-4 divide-y divide-[var(--border)]">
              {[
                { label: "Total records", value: totalRecords.toLocaleString() },
                { label: "Governance registers", value: "12 live" },
                { label: "Funding readiness", value: `${readinessPct}%` },
                { label: "Evidence files", value: String(counts.files) },
                { label: "Open tasks", value: String(openTasks.length) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <dt className="text-sm text-[var(--muted-foreground)]">{row.label}</dt>
                  <dd className="text-sm font-semibold text-[var(--foreground)]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Command Stats Grid ── */}
      <section className="mt-6">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Registry Overview
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <Stat label="People" value={counts.people} href="/people" />
          <Stat label="Whakapapa" value={counts.whakapapa} href="/whakapapa" />
          <Stat label="Whenua" value={counts.whenua} href="/whenua" />
          <Stat label="Marae" value={counts.marae} href="/marae" />
          <Stat label="Hui" value={counts.hui} href="/hui" />
          <Stat label="Minutes" value={counts.minutes} href="/minutes" />
          <Stat label="Decisions" value={counts.decisions} href="/decisions" />
          <Stat label="Tasks" value={counts.tasks} href="/tasks" />
          <Stat label="Documents" value={counts.documents} href="/documents" />
          <Stat label="Evidence Files" value={counts.files} href="/library/evidence" accent />
        </div>
      </section>

      {/* ── Governance Chain + Open Tasks ── */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Governance Chain Status */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Governance Chain
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--foreground)]">
            Hui → Minutes → Decisions → Tasks
          </h2>

          {/* Chain flow */}
          <div className="mt-5 flex items-stretch gap-1">
            {[
              { label: "Hui", count: counts.hui, href: "/hui" },
              { label: "Minutes", count: counts.minutes, href: "/minutes" },
              { label: "Decisions", count: counts.decisions, href: "/decisions" },
              { label: "Tasks", count: counts.tasks, href: "/tasks" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-1">
                <Link
                  href={step.href}
                  className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-3 text-center transition hover:border-[var(--accent)]"
                >
                  <span className="text-xl font-semibold text-[var(--foreground)]">
                    {step.count}
                  </span>
                  <span className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">
                    {step.label}
                  </span>
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-xs text-[var(--muted-foreground)]">→</span>
                )}
              </div>
            ))}
          </div>

          {/* Recent decisions */}
          {recentDecisions.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">
                Recent decisions
              </p>
              <div className="divide-y divide-[var(--border)]">
                {recentDecisions.map((d) => (
                  <Link
                    key={d.id}
                    href={`/decisions/${d.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm transition first:pt-0 last:pb-0 hover:opacity-75"
                  >
                    <span className="truncate font-medium text-[var(--foreground)]">
                      {d.title || "Untitled decision"}
                    </span>
                    <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                      {d.status || "—"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <Link
              href="/reports/governance-chain"
              className="text-xs font-medium text-[var(--accent)] transition hover:opacity-75"
            >
              Full governance chain report →
            </Link>
          </div>
        </section>

        {/* Open Tasks + Funding Readiness */}
        <div className="flex flex-col gap-5">
          {/* Funding Readiness */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                  Funding Readiness
                </p>
                <p className="mt-0.5 text-base font-semibold text-[var(--foreground)]">
                  {readinessPct}% complete
                </p>
              </div>
              <span className="text-2xl font-semibold text-[var(--foreground)]">
                {readinessDone}
                <span className="text-sm font-normal text-[var(--muted-foreground)]">
                  /{readinessChecks.length}
                </span>
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all"
                style={{ width: `${readinessPct}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {readinessChecks.map((check) => (
                <span
                  key={check.label}
                  className={`flex items-center gap-1.5 text-xs ${
                    check.done ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)] line-through"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      check.done ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                    }`}
                  />
                  {check.label}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/finance"
                className="text-xs font-medium text-[var(--accent)] transition hover:opacity-75"
              >
                Finance & Assets hub →
              </Link>
            </div>
          </section>

          {/* Open Tasks */}
          <section className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                Open Tasks
              </p>
              <Link
                href="/tasks"
                className="text-xs font-medium text-[var(--muted-foreground)] transition hover:text-[var(--accent)]"
              >
                All tasks →
              </Link>
            </div>

            {openTasks.length === 0 ? (
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-center">
                <p className="text-sm text-[var(--muted-foreground)]">No open tasks</p>
                <Link
                  href="/tasks/new"
                  className="mt-3 inline-block text-xs font-medium text-[var(--accent)] transition hover:opacity-75"
                >
                  Add task →
                </Link>
              </div>
            ) : (
              <div className="mt-3 divide-y divide-[var(--border)]">
                {openTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm transition first:pt-0 last:pb-0 hover:opacity-75"
                  >
                    <span className="truncate font-medium text-[var(--foreground)]">
                      {task.title || "Untitled task"}
                    </span>
                    <span className="shrink-0 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]">
                      {task.priority || task.status || "open"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Add Hui", href: "/hui/new" },
            { label: "Add Decision", href: "/decisions/new" },
            { label: "Add Task", href: "/tasks/new" },
            { label: "Add Person", href: "/people/new" },
            { label: "Add Whenua", href: "/whenua/new" },
            { label: "Add Document", href: "/documents/new" },
            { label: "Add Minutes", href: "/minutes/new" },
            { label: "Add Pānui", href: "/panui/new" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Register Categories ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Governance Registers
        </p>

        <div className="space-y-8">
          {[
            {
              group: "Whakapapa & People",
              desc: "Identity, whakapapa, kinship, and capability records.",
              items: [
                { label: "People", href: "/people", count: counts.people },
                { label: "Whakapapa", href: "/whakapapa", count: counts.whakapapa },
              ],
            },
            {
              group: "Whenua",
              desc: "Land blocks, legal descriptions, and land evidence.",
              items: [
                { label: "Whenua", href: "/whenua", count: counts.whenua },
              ],
            },
            {
              group: "Marae",
              desc: "Marae profiles, hui, and community notices.",
              items: [
                { label: "Marae", href: "/marae", count: counts.marae },
                { label: "Hui", href: "/hui", count: counts.hui },
                { label: "Pānui", href: "/panui", count: counts.panui },
              ],
            },
            {
              group: "Governance",
              desc: "Authority, minutes, decisions, and governance chain.",
              items: [
                { label: "Governance Records", href: "/governance", count: counts.governance },
                { label: "Minutes", href: "/minutes", count: counts.minutes },
                { label: "Decisions", href: "/decisions", count: counts.decisions },
              ],
            },
            {
              group: "Finance & Assets",
              desc: "Funding readiness, evidence, and asset intelligence.",
              items: [
                { label: "Finance & Assets Hub", href: "/finance", count: null },
                { label: "Funding Readiness", href: "/reports/funding-readiness", count: null },
              ],
            },
            {
              group: "Work & Delivery",
              desc: "Tasks assigned from decisions.",
              items: [
                { label: "Tasks", href: "/tasks", count: counts.tasks },
              ],
            },
            {
              group: "Library & Archive",
              desc: "Documents, evidence, and the full archive.",
              items: [
                { label: "Library", href: "/library", count: null },
                { label: "Documents", href: "/documents", count: counts.documents },
                { label: "Evidence Files", href: "/library/evidence", count: counts.files },
              ],
            },
            {
              group: "Intelligence",
              desc: "Reports, chains, and readiness indicators.",
              items: [
                { label: "Reports", href: "/reports", count: null },
                { label: "Governance Chain", href: "/reports/governance-chain", count: null },
                { label: "Marae Governance", href: "/reports/marae-governance", count: null },
              ],
            },
          ].map((category) => (
            <div key={category.group}>
              <div className="mb-2.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                  {category.group}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {category.desc}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm transition hover:border-[var(--accent)]"
                  >
                    <span className="font-medium text-[var(--foreground)]">
                      {item.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-[var(--muted-foreground)] transition group-hover:text-[var(--accent)]">
                      {item.count !== null && (
                        <span className="text-xs font-semibold">{item.count}</span>
                      )}
                      <span className="text-base leading-none">›</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
