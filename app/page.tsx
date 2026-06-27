import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

const orgTypeLabels: Record<string, string> = {
  hapu: "Hapū",
  marae_trust: "Marae Trust",
  maori_trust: "Māori Trust",
  charitable_trust: "Charitable Trust",
  iwi_organisation: "Iwi Organisation",
  maori_business: "Māori Business",
  community_organisation: "Community Organisation",
  service_provider: "Service Provider",
  other: "Other",
};

export default async function HomePage() {
  const [
    orgRes,
    peopleRes, whenuaRes, maraeRes, huiRes, minutesRes, decisionsRes,
    tasksRes, documentsRes, filesRes, governanceRes, whakapapaRes,
    panuiRes, activityRes,
    openTasksRes, recentDecisionsRes,
  ] = await Promise.all([
    supabase.from("organisation_profiles").select("organisation_name, organisation_type, kaupapa, status").order("created_at", { ascending: true }).limit(1).maybeSingle(),
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

  const orgProfile = orgRes.data as {
    organisation_name: string;
    organisation_type: string | null;
    kaupapa: string | null;
    status: string | null;
  } | null;

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

      {/* ── Setup prompt if no org profile ── */}
      {!orgProfile && (
        <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--accent)]/40 bg-[var(--surface)] px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Set up your organisation profile first
            </p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              The organisation profile is the hapū-held source of truth that anchors all governance, evidence, reporting, and outcome records in Tangata.
            </p>
          </div>
          <Link
            href="/organisation/new"
            className="shrink-0 rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Set Up Organisation Profile
          </Link>
        </section>
      )}

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent)]" />
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12 lg:p-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              Governance OS
            </p>
            {orgProfile ? (
              <>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                  {orgProfile.organisation_name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {orgProfile.organisation_type && (
                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                      {orgTypeLabels[orgProfile.organisation_type] ?? orgProfile.organisation_type}
                    </span>
                  )}
                  {orgProfile.status && orgProfile.status !== "active" && (
                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                      {orgProfile.status}
                    </span>
                  )}
                </div>
                {orgProfile.kaupapa && (
                  <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                    {orgProfile.kaupapa}
                  </p>
                )}
              </>
            ) : (
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Tangata
              </h1>
            )}
            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
              A hapū-held governance, evidence, mandate, and reporting system — built for Māori organisations, hapū, marae, trusts, and Māori businesses.
              Manage your own information, prove your own process, control what is shared externally, and negotiate from your own data.
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
                Search Records
              </Link>
              <Link
                href="/reports"
                className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Reports
              </Link>
              {orgProfile && (
                <Link
                  href="/organisation"
                  className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Organisation Profile
                </Link>
              )}
            </div>
          </div>

          {/* Funding readiness */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              Funding Readiness
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              {readinessPct}
              <span className="ml-1 text-base font-normal text-[var(--muted-foreground)]">%</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all"
                style={{ width: `${readinessPct}%` }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
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
            <div className="mt-5">
              <Link
                href="/reports/funding-readiness"
                className="text-xs font-medium text-[var(--accent)] transition hover:opacity-75"
              >
                Full funding readiness report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Chain ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          How Tangata Works
        </p>
        <h2 className="mt-1 text-base font-semibold text-[var(--foreground)]">
          From organisation-held data to controlled outcomes
        </h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Every step in this chain is recorded, linked, and reportable. Together they prove the process, show the mandate,
          and create the evidence base for controlled sharing, negotiation, and reporting back to the people.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          {[
            { label: "People & Data", sub: "organisation-held", href: "/people" },
            { label: "Hui", sub: "consultation", href: "/hui" },
            { label: "Minutes", sub: "record", href: "/minutes" },
            { label: "Decisions", sub: "formalise", href: "/decisions" },
            { label: "Tasks", sub: "action", href: "/tasks" },
            { label: "Evidence", sub: "prove", href: "/library/evidence" },
            { label: "Controlled Sharing", sub: "permissioned access", href: "/reports" },
            { label: "Outcomes", sub: "negotiate from evidence", href: "/reports/governance-chain" },
            { label: "Report Back", sub: "to the people", href: "/reports" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2">
              <Link
                href={step.href}
                className="group flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-center transition hover:border-[var(--accent)]"
              >
                <span className="text-xs font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                  {step.label}
                </span>
                <span className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">
                  {step.sub}
                </span>
              </Link>
              {i < arr.length - 1 && (
                <span className="text-xs text-[var(--muted-foreground)]">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          Tangata is the trusted middle layer between your organisation and external parties —
          councils, funders, iwi bodies, service providers, and statutory agencies.
          Not a middleman that takes control. A data-sovereignty layer that lets your organisation negotiate from its own evidence.
        </p>
      </section>

      {/* ── Registry Stats ── */}
      <section className="mt-6">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Registry Overview
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <Stat label="People" value={counts.people} href="/people" />
          <Stat label="Whakapapa" value={counts.whakapapa} href="/whakapapa" />
          <Stat label="Marae" value={counts.marae} href="/marae" />
          <Stat label="Whenua" value={counts.whenua} href="/whenua" />
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
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Each link in the chain proves the process. Together they show mandate.
          </p>

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

        {/* Open Tasks */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                Open Tasks
              </p>
              <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                Actions assigned from decisions
              </p>
            </div>
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

      {/* ── Six Product Areas ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Product Areas
        </p>

        <div className="space-y-8">
          {[
            {
              group: "Organisation Profile",
              desc: "The hapū-held source of truth. Defines who owns this data, what type of organisation holds it, what kaupapa it serves, and what mandate and relationships matter. Every record in Tangata belongs to this organisation.",
              items: [
                { label: "Organisation Profile", href: "/organisation", count: null },
              ],
            },
            {
              group: "People & Relationships",
              desc: "Identity, whakapapa, kinship, roles, knowledge, and participation records. Who are the people, what are their relationships, and what capability exists?",
              items: [
                { label: "People", href: "/people", count: counts.people },
                { label: "Whakapapa", href: "/whakapapa", count: counts.whakapapa },
              ],
            },
            {
              group: "Hapū, Marae & Whenua",
              desc: "The collectives, places, and lands being governed. Marae profiles, whenua blocks, and the cultural base for governance and mandate.",
              items: [
                { label: "Marae", href: "/marae", count: counts.marae },
                { label: "Whenua", href: "/whenua", count: counts.whenua },
              ],
            },
            {
              group: "Governance Chain",
              desc: "Hui → Minutes → Decisions → Tasks → Outcomes. This is the workflow that proves process, records participation, and creates a mandate for action.",
              items: [
                { label: "Hui", href: "/hui", count: counts.hui },
                { label: "Minutes", href: "/minutes", count: counts.minutes },
                { label: "Decisions", href: "/decisions", count: counts.decisions },
                { label: "Tasks", href: "/tasks", count: counts.tasks },
                { label: "Governance Records", href: "/governance", count: counts.governance },
              ],
            },
            {
              group: "Library & Evidence",
              desc: "Documents, file references, and evidence — the archive that gives governance decisions their legal, historical, and funding weight.",
              items: [
                { label: "Library", href: "/library", count: null },
                { label: "Documents", href: "/documents", count: counts.documents },
                { label: "Evidence Files", href: "/library/evidence", count: counts.files },
              ],
            },
            {
              group: "Intelligence & Outcomes",
              desc: "Turn records into insight, mandate, funding readiness, and measurable outcomes. Reports prove the process, show the mandate, and provide the evidence base for controlled, purpose-based sharing with external parties. Report back to the people.",
              items: [
                { label: "Reports", href: "/reports", count: null },
                { label: "Governance Chain", href: "/reports/governance-chain", count: null },
                { label: "Funding Readiness", href: "/reports/funding-readiness", count: null },
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
