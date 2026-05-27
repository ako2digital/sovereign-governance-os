import AppShell from "@/components/layout/AppShell";

const modules = [
  {
    name: "People",
    href: "/people",
    description:
      "Manage people connected to whakapapa, whenua, hui, documents, and tasks.",
    count: 0,
  },
  {
    name: "Whakapapa",
    href: "/whakapapa",
    description: "Record basic whakapapa relationships and connection notes.",
    count: 0,
  },
  {
    name: "Whenua",
    href: "/whenua",
    description:
      "Organise whenua records, references, notes, and linked documents.",
    count: 0,
  },
  {
    name: "Marae",
    href: "/marae",
    description:
      "Store marae records, governance notes, documents, hui, and decisions.",
    count: 0,
  },
  {
    name: "Governance",
    href: "/governance",
    description:
      "Track governance records, mandates, policies, resolutions, and authority.",
    count: 0,
  },
  {
    name: "Hui",
    href: "/hui",
    description:
      "Create hui records connected to minutes, decisions, documents, and tasks.",
    count: 0,
  },
  {
    name: "Documents",
    href: "/documents",
    description:
      "Store document records and connect them to people, whenua, hui, and decisions.",
    count: 0,
  },
  {
    name: "Tasks",
    href: "/tasks",
    description:
      "Track follow-up actions, responsibility, status, and accountability.",
    count: 0,
  },
];

const recentActivity = [
  "Dashboard shell created",
  "Obsidian brain completed",
  "Next.js app created",
  "GitHub repository connected",
];

const openTasks = [
  "Create reusable app layout",
  "Refactor module pages into AppShell",
  "Draft Supabase SQL schema",
  "Review Supabase project setup",
];

export default function Home() {
  return (
    <AppShell>
      <section className="mb-8 rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-stone-500">
          MVP Foundation
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white">
          A relational records system for whakapapa, whenua, marae governance,
          hui, documents, decisions, pānui, tasks, and activity history.
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-7 text-stone-400">
          This first build is not the full sovereign infrastructure platform. It
          is the first working records layer: simple, demoable, and structured
          enough to grow.
        </p>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <a
            key={module.name}
            href={module.href}
            className="rounded-2xl border border-stone-800 bg-stone-900 p-5 transition hover:border-stone-600 hover:bg-stone-800"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">{module.name}</h2>
              <span className="rounded-full bg-stone-800 px-3 py-1 text-xs text-stone-300">
                {module.count}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-stone-400">
              {module.description}
            </p>
          </a>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>

          <div className="mt-5 space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-sm text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">Open Tasks</h2>

          <div className="mt-5 space-y-3">
            {openTasks.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-sm text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
