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
    status: "Next",
  },
  {
    title: "Minutes",
    href: "/minutes",
    description: "Formal notes and summaries from hui records.",
    status: "Planned",
  },
  {
    title: "Decisions",
    href: "/decisions",
    description:
      "Decision records connected to hui, governance, and follow-up actions.",
    status: "Planned",
  },
  {
    title: "Documents",
    href: "/documents",
    description:
      "Supporting files, evidence, maps, photos, and formal records.",
    status: "Planned",
  },
  {
    title: "Pānui",
    href: "/panui",
    description: "Communication records, notices, updates, and announcements.",
    status: "Planned",
  },
  {
    title: "Tasks",
    href: "/tasks",
    description:
      "Follow-up actions connected to hui, decisions, documents, and whenua.",
    status: "Planned",
  },
  {
    title: "Activity",
    href: "/activity",
    description: "Audit trail for actions, updates, and record history.",
    status: "Planned",
  },
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
];

const nextActions = [
  {
    title: "Standardise Hui pages",
    area: "Governance / Hui",
    href: "/hui",
  },
  {
    title: "Connect Minutes module",
    area: "Governance / Minutes",
    href: "/minutes",
  },
  {
    title: "Connect Decisions module",
    area: "Governance / Decisions",
    href: "/decisions",
  },
  {
    title: "Connect Documents module",
    area: "Records / Documents",
    href: "/documents",
  },
];

function statusClass(status: string) {
  if (status === "Live") {
    return "border-green-900 bg-green-950/30 text-green-300";
  }

  if (status === "Next") {
    return "border-stone-600 bg-stone-100 text-stone-950";
  }

  return "border-stone-700 bg-stone-950 text-stone-400";
}

export default function HomePage() {
  return (
    <AppShell title="Dashboard" eyebrow="Sovereign Governance OS">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Operations Dashboard
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Sovereign Governance OS
        </h1>

        <p className="mt-4 max-w-3xl text-stone-400">
          A practical record system for people, whakapapa, whenua, marae,
          governance, hui, minutes, decisions, documents, tasks, pānui, and
          activity history.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Module Register
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Core system areas and current build status.
            </p>
          </div>

          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            {modules.length} modules
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <a
              key={module.title}
              href={module.href}
              className="group rounded-2xl border border-stone-800 bg-stone-950 p-5 transition hover:border-stone-600 hover:bg-stone-900"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-white">
                  {module.title}
                </h3>

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

              <p className="mt-4 text-sm font-medium text-stone-500 transition group-hover:text-white">
                Open {module.title} →
              </p>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
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

        <section className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Next Actions
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Work queue for the next build pass.
              </p>
            </div>

            <a
              href="/tasks"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View Tasks
            </a>
          </div>

          <div className="mt-6 grid gap-3">
            {nextActions.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-stone-400">{item.area}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}