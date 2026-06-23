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

const quickActions = [
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

const activityItems = [
  {
    action: "People register connected",
    area: "Core Records",
    status: "Complete",
    href: "/people",
  },
  {
    action: "Whakapapa relationships connected",
    area: "Core Records",
    status: "Complete",
    href: "/whakapapa",
  },
  {
    action: "Whenua records connected",
    area: "Core Records",
    status: "Complete",
    href: "/whenua",
  },
  {
    action: "Marae records connected",
    area: "Governance",
    status: "Complete",
    href: "/marae",
  },
  {
    action: "Governance records connected",
    area: "Governance",
    status: "Complete",
    href: "/governance",
  },
  {
    action: "Hui records connected",
    area: "Governance",
    status: "Complete",
    href: "/hui",
  },
  {
    action: "Minutes records connected",
    area: "Governance",
    status: "Complete",
    href: "/minutes",
  },
  {
    action: "Decisions records connected",
    area: "Governance",
    status: "Complete",
    href: "/decisions",
  },
  {
    action: "Documents register connected",
    area: "Records",
    status: "Complete",
    href: "/documents",
  },
  {
    action: "Pānui register connected",
    area: "Records",
    status: "Complete",
    href: "/panui",
  },
  {
    action: "Tasks register connected",
    area: "Records",
    status: "Complete",
    href: "/tasks",
  },
  {
    action: "Activity log connected",
    area: "Records",
    status: "Complete",
    href: "/activity",
  },
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

const themeDirections = [
  {
    theme: "Dark Theme",
    title: "Sovereign Command Centre",
    badge: "Active",
    description:
      "Charcoal surfaces, thin stone borders, and green live-status accents for the operational, day-to-day view of the registry.",
    swatches: [
      "border-stone-700 bg-stone-950",
      "border-stone-700 bg-stone-800",
      "border-green-900 bg-green-600",
    ],
    light: false,
  },
  {
    theme: "Light Theme",
    title: "Registry Dossier",
    badge: "Direction",
    description:
      "Off-white, cream, and stone tones for an archival, paper-register feel — a future documentation-mode direction, contained here as a design reference.",
    swatches: [
      "border-stone-300 bg-stone-100",
      "border-stone-300 bg-stone-200",
      "border-stone-400 bg-stone-950",
    ],
    light: true,
  },
];

function statusClass(status: string) {
  if (status === "Live") {
    return "border-green-900 bg-green-950/30 text-green-300";
  }

  return "border-stone-700 bg-stone-950 text-stone-400";
}

export default function HomePage() {
  return (
    <AppShell title="Dashboard" eyebrow="Sovereign Governance OS">
      <section className="rounded-3xl border border-stone-700/60 bg-stone-900/60 p-8 shadow-2xl shadow-black/40 lg:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
          Governance Command Centre
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
          Sovereign Governance OS
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-100">
          A sovereign registry for governance records, documentation, hui,
          decisions, whenua, marae, pānui, tasks, and activity history.
        </p>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
          Later layers extend this foundation with the full whakapapa graph,
          permissions, verification, activity automation, and role-based
          access.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-green-900 bg-green-950/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-green-300">
            Live Registry
          </div>

          <div className="rounded-full border border-stone-700 bg-stone-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            {modules.length} Modules
          </div>

          <div className="rounded-full border border-stone-700 bg-stone-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            {quickActions.length} Quick Actions
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="/people/new"
            className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-black/30 transition hover:bg-white"
          >
            New Record
          </a>

          <a
            href="/design-test"
            className="rounded-xl border border-stone-700 bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Design Preview
          </a>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-950/40 p-6 shadow-lg shadow-black/20">
        <div>
          <h2 className="text-lg font-semibold text-white">Visual System</h2>

          <p className="mt-1 text-sm text-stone-400">
            Two design directions for the registry — the operational dark
            view in use today, and an archival paper-register direction
            reserved for later.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {themeDirections.map((direction) => (
            <div
              key={direction.theme}
              className={
                direction.light
                  ? "rounded-2xl border border-stone-300 bg-stone-100 p-6 text-stone-950 shadow-lg shadow-black/20"
                  : "rounded-2xl border border-stone-700/60 bg-stone-900 p-6 shadow-lg shadow-black/20"
              }
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
                  {direction.theme}
                </p>

                <span
                  className={
                    direction.badge === "Active"
                      ? "rounded-full border border-green-900 bg-green-950/30 px-3 py-1 text-xs font-medium text-green-300"
                      : direction.light
                        ? "rounded-full border border-stone-400 bg-white px-3 py-1 text-xs font-medium text-stone-600"
                        : "rounded-full border border-stone-700 bg-stone-950 px-3 py-1 text-xs font-medium text-stone-400"
                  }
                >
                  {direction.badge}
                </span>
              </div>

              <h3
                className={
                  direction.light
                    ? "mt-3 text-base font-semibold text-stone-950"
                    : "mt-3 text-base font-semibold text-white"
                }
              >
                {direction.title}
              </h3>

              <p
                className={
                  direction.light
                    ? "mt-2 text-sm leading-6 text-stone-600"
                    : "mt-2 text-sm leading-6 text-stone-400"
                }
              >
                {direction.description}
              </p>

              <div className="mt-5 flex gap-2">
                {direction.swatches.map((swatch) => (
                  <span
                    key={swatch}
                    className={`h-6 w-6 rounded-md border ${swatch}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-950/40 p-6 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Module Register
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Core system areas — live across the registry.
            </p>
          </div>

          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            {modules.length} modules
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => (
            <a
              key={module.title}
              href={module.href}
              className="group rounded-2xl border border-stone-700/60 bg-stone-900 p-6 shadow-lg shadow-black/20 transition hover:border-stone-500 hover:bg-stone-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-600">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-white">
                    {module.title}
                  </h3>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClass(
                    module.status
                  )}`}
                >
                  {module.status}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-stone-400">
                {module.description}
              </p>

              <p className="mt-5 text-sm font-medium text-stone-500 transition group-hover:text-white">
                Open {module.title} →
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-950/40 p-6 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>

          <span className="rounded-full border border-stone-700 bg-stone-950 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            Create
          </span>
        </div>

        <p className="mt-1 text-sm text-stone-400">
          Create a new record directly in an existing module.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-stone-700/60 bg-stone-900 p-4 shadow-md shadow-black/20 transition hover:border-stone-500 hover:bg-stone-800"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-700 text-sm font-semibold text-stone-400 transition group-hover:border-stone-500 group-hover:text-white">
                +
              </span>

              <h3 className="text-sm font-semibold text-white">
                {action.title}
              </h3>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section className="rounded-2xl border border-stone-700/60 bg-stone-900/60 p-6 shadow-lg shadow-black/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Current Activity
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                System progress and connected records.
              </p>
            </div>

            <a
              href="/activity"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View Activity
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {activityItems.map((item) => (
                  <tr
                    key={item.action}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4">
                      <a
                        href={item.href}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {item.action}
                      </a>
                    </td>

                    <td className="px-4 py-4 text-stone-300">{item.area}</td>

                    <td className="px-4 py-4 text-stone-300">
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-700/60 bg-stone-900/60 p-6 shadow-lg shadow-black/20">
          <div>
            <h2 className="text-lg font-semibold text-white">Roadmap</h2>

            <p className="mt-1 text-sm text-stone-400">
              Phase 1 is live today. Later phases extend this foundation.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {roadmapPhases.map((item) => (
              <div
                key={item.phase}
                className="rounded-xl border border-stone-700/60 bg-stone-950 p-4 shadow-md shadow-black/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
                    {item.phase}
                  </p>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      item.current
                        ? "border-green-900 bg-green-950/30 text-green-300"
                        : "border-stone-700 bg-stone-950 text-stone-400"
                    }`}
                  >
                    {item.current ? "Current" : "Planned"}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-stone-400">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
