import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const modules = [
  {
    title: "People",
    href: "/people",
    description:
      "Identity records for people connected to whakapapa, hui, tasks, roles, and activity.",
    status: "Live",
  },
  {
    title: "Whakapapa",
    href: "/whakapapa",
    description: "Relationship records connecting one person to another.",
    status: "Live",
  },
  {
    title: "Whenua",
    href: "/whenua",
    description:
      "Land records, legal descriptions, historical notes, and references.",
    status: "Live",
  },
  {
    title: "Marae",
    href: "/marae",
    description:
      "Marae records connected to whenua, hui, governance, and documents.",
    status: "Live",
  },
  {
    title: "Governance",
    href: "/governance",
    description:
      "Mandates, policies, authority records, decisions, and governance context.",
    status: "Live",
  },
  {
    title: "Hui",
    href: "/hui",
    description:
      "Meeting records connected to minutes, decisions, tasks, and documents.",
    status: "Live",
  },
  {
    title: "Minutes",
    href: "/minutes",
    description: "Formal notes and summaries from hui records.",
    status: "Live",
  },
  {
    title: "Decisions",
    href: "/decisions",
    description:
      "Decision records connected to hui, governance, and follow-up actions.",
    status: "Live",
  },
  {
    title: "Documents",
    href: "/documents",
    description:
      "Supporting files, evidence, maps, photos, and formal records.",
    status: "Live",
  },
  {
    title: "Pānui",
    href: "/panui",
    description: "Communication records, notices, updates, and announcements.",
    status: "Live",
  },
  {
    title: "Tasks",
    href: "/tasks",
    description:
      "Follow-up actions connected to hui, decisions, documents, and whenua.",
    status: "Live",
  },
  {
    title: "Activity",
    href: "/activity",
    description: "Audit trail for actions, updates, and record history.",
    status: "Live",
  },
];

const createOptions = [
  { title: "Add Person", href: "/people/new" },
  { title: "Add Whakapapa Relationship", href: "/whakapapa/new" },
  { title: "Add Whenua Record", href: "/whenua/new" },
  { title: "Add Marae Record", href: "/marae/new" },
  { title: "Add Governance Record", href: "/governance/new" },
  { title: "Add Hui", href: "/hui/new" },
  { title: "Add Minutes", href: "/minutes/new" },
  { title: "Add Decision", href: "/decisions/new" },
  { title: "Add Document", href: "/documents/new" },
  { title: "Add Pānui", href: "/panui/new" },
  { title: "Add Task", href: "/tasks/new" },
];

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Governance Registry",
    note: "Stable record management for people, whenua, marae, governance, hui, minutes, decisions, documents, pānui, tasks, and activity history.",
    current: true,
  },
  {
    phase: "Phase 2",
    title: "Activity Logging + Edit Workflows",
    note: "System-generated activity history and structured editing across existing records.",
    current: false,
  },
  {
    phase: "Phase 3",
    title: "Permissions + Verification",
    note: "Role-based access and verification workflows for governance records.",
    current: false,
  },
  {
    phase: "Phase 4",
    title: "Whakapapa Graph + Advanced Relational Layer",
    note: "The full whakapapa graph, beyond today's basic relationship register.",
    current: false,
  },
];

const currentPhase = roadmapPhases.find((phase) => phase.current);

const overviewStats = [
  {
    label: "Modules live",
    value: String(modules.length),
    caption: "Registry areas in production",
    accent: false,
  },
  {
    label: "Current phase",
    value: currentPhase?.phase ?? "Phase 1",
    caption: currentPhase?.title ?? "Governance Registry",
    accent: false,
  },
  {
    label: "System status",
    value: "Live",
    caption: "Registry operating normally",
    accent: true,
  },
];

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />;
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 lg:p-10 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {description}
          </p>
        ) : null}
      </div>

      {meta}
    </div>
  );
}

export default function HomePage() {
  return (
    <AppShell title="Dashboard" eyebrow="Sovereign Governance OS">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]" />

        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-16 lg:p-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Governance Command Centre
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-6xl">
              Sovereign Governance OS
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--foreground)]">
              A sovereign governance OS — registry, evidence archive,
              chain-of-decision reporting, and funding-readiness monitoring
              for Māori organisations.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
              Governance chains link hui → minutes → decisions → tasks.
              Every record supports file and evidence references.
              Reports turn data into accountability evidence ready for
              funders and auditors.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/hui/new"
                className="rounded-lg bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                New Hui
              </Link>

              <Link
                href="/library"
                className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] dark:hover:bg-white/5"
              >
                Library
              </Link>

              <Link
                href="/reports"
                className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] dark:hover:bg-white/5"
              >
                Reports
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-7 dark:bg-white/5 dark:backdrop-blur-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Registry Summary
            </p>

            <dl className="mt-5 divide-y divide-[var(--border)]">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <dt className="text-sm text-[var(--muted-foreground)]">
                  Status
                </dt>
                <dd className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <Dot />
                  Live
                </dd>
              </div>

              <div className="flex items-center justify-between py-3">
                <dt className="text-sm text-[var(--muted-foreground)]">
                  Modules
                </dt>
                <dd className="text-sm font-medium text-[var(--foreground)]">
                  {modules.length} active
                </dd>
              </div>

              <div className="flex items-center justify-between py-3 last:pb-0">
                <dt className="text-sm text-[var(--muted-foreground)]">
                  Current phase
                </dt>
                <dd className="text-sm font-medium text-[var(--foreground)]">
                  {currentPhase?.phase ?? "Phase 1"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader
          eyebrow="Registry Overview"
          title="System at a glance"
          description="Live counts pulled directly from the registry's active modules."
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {overviewStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <p className="text-sm text-[var(--muted-foreground)]">
                {stat.label}
              </p>

              <p
                className={`mt-2 text-3xl font-semibold ${
                  stat.accent
                    ? "text-[var(--accent)]"
                    : "text-[var(--foreground)]"
                }`}
              >
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {stat.caption}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Panel className="mt-14">
        <SectionHeader
          eyebrow="Module Register"
          title="Core Systems"
          description="Every system below is live across the registry."
          meta={
            <span className="text-sm text-[var(--muted-foreground)]">
              {modules.length} modules
            </span>
          }
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-colors hover:border-[var(--accent)]"
            >
              <span className="pointer-events-none absolute inset-0 bg-[var(--accent)] opacity-0 transition-opacity duration-200 group-hover:opacity-10" />

              <div className="relative flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {module.title}
                </h3>

                <span className="flex items-center gap-2 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--accent)]">
                  <Dot />
                  <span aria-hidden="true" className="text-base leading-none">
                    ›
                  </span>
                </span>
              </div>

              <p className="relative mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      </Panel>

      <Panel className="mt-14">
        <SectionHeader
          eyebrow="Future Layers"
          title="Roadmap"
          description="Phase 1 is live today. Later phases extend this foundation."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {roadmapPhases.map((item) => (
            <div
              key={item.phase}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {item.phase}
                </p>

                <span
                  className={`text-xs font-medium ${
                    item.current
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {item.current ? "Current" : "Planned"}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <details className="group fixed bottom-6 right-6 z-30">
        <summary className="flex w-fit list-none items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] shadow-lg shadow-black/20 transition hover:opacity-90 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true">+</span>
          New Record
        </summary>

        <div className="absolute bottom-full right-0 mb-3 max-h-[70vh] w-64 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-2 shadow-xl shadow-black/10 dark:bg-white/5 dark:backdrop-blur-md dark:shadow-black/40">
          {createOptions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="block rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              {action.title}
            </Link>
          ))}
        </div>
      </details>
    </AppShell>
  );
}
