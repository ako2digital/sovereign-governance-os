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
    description: "Organise whenua records, references, notes, and linked documents.",
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
    name: "Minutes",
    href: "/minutes",
    description: "Preserve what happened, what was discussed, and what followed.",
    count: 0,
  },
  {
    name: "Decisions",
    href: "/decisions",
    description:
      "Record decisions, resolutions, responsible people, and follow-up actions.",
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
    name: "Pānui",
    href: "/panui",
    description:
      "Record notices, announcements, updates, and communication history.",
    count: 0,
  },
  {
    name: "Tasks",
    href: "/tasks",
    description:
      "Track follow-up actions, responsibility, status, and accountability.",
    count: 0,
  },
  {
    name: "Activity",
    href: "/activity",
    description:
      "View recent system activity and prepare for stronger audit history.",
    count: 0,
  },
];

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "People", href: "/people" },
  { name: "Whakapapa", href: "/whakapapa" },
  { name: "Whenua", href: "/whenua" },
  { name: "Marae", href: "/marae" },
  { name: "Governance", href: "/governance" },
  { name: "Hui", href: "/hui" },
  { name: "Minutes", href: "/minutes" },
  { name: "Decisions", href: "/decisions" },
  { name: "Documents", href: "/documents" },
  { name: "Pānui", href: "/panui" },
  { name: "Tasks", href: "/tasks" },
  { name: "Activity", href: "/activity" },
];

const recentActivity = [
  "Dashboard shell created",
  "Obsidian brain completed",
  "Next.js app created",
  "GitHub repository connected",
];

const openTasks = [
  "Create placeholder module pages",
  "Draft Supabase SQL schema",
  "Review Supabase project setup",
  "Create first reusable app layout",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-stone-800 bg-stone-950 px-6 py-6 lg:block">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Sovereign OS
            </p>
            <h1 className="mt-3 text-xl font-semibold text-stone-100">
              Hapū Relational Infrastructure
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              MVP foundation for records, relationships, decisions, and
              accountability.
            </p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm transition ${
                  item.name === "Dashboard"
                    ? "bg-stone-800 text-white"
                    : "text-stone-400 hover:bg-stone-900 hover:text-stone-100"
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        <section className="flex-1">
          <header className="border-b border-stone-800 bg-stone-950/80 px-6 py-5">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  30-Day MVP Sprint
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Sovereign Governance OS
                </h2>
              </div>

              <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
                Week 1 — Foundation
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-8">
            <section className="mb-8 rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-stone-500">
                MVP Foundation
              </p>

              <h3 className="max-w-4xl text-4xl font-semibold tracking-tight text-white">
                A relational records system for whakapapa, whenua, marae
                governance, hui, documents, decisions, pānui, tasks, and
                activity history.
              </h3>

              <p className="mt-5 max-w-3xl text-base leading-7 text-stone-400">
                This first build is not the full sovereign infrastructure
                platform. It is the first working records layer: simple,
                demoable, and structured enough to grow.
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
                    <h4 className="text-lg font-semibold text-white">
                      {module.name}
                    </h4>
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
                <h4 className="text-lg font-semibold text-white">
                  Recent Activity
                </h4>

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
                <h4 className="text-lg font-semibold text-white">Open Tasks</h4>

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
          </div>
        </section>
      </div>
    </main>
  );
}