import AppShell from "@/components/layout/AppShell";

const coreModules = [
  {
    title: "People",
    href: "/people",
    eyebrow: "Identity layer",
    description:
      "Maintain the people register that anchors whakapapa, hui attendance, tasks, roles, and record ownership.",
    status: "Live",
  },
  {
    title: "Whakapapa",
    href: "/whakapapa",
    eyebrow: "Relationship layer",
    description:
      "Connect people to people so records are not isolated names, but part of a living relational structure.",
    status: "Live",
  },
  {
    title: "Whenua",
    href: "/whenua",
    eyebrow: "Place layer",
    description:
      "Store whenua records, land references, historical notes, legal descriptions, and supporting context.",
    status: "Live",
  },
  {
    title: "Marae",
    href: "/marae",
    eyebrow: "Community layer",
    description:
      "Hold marae records, contacts, governance links, location details, and operational information.",
    status: "Next",
  },
  {
    title: "Governance",
    href: "/governance",
    eyebrow: "Authority layer",
    description:
      "Track governance structures, roles, mandates, responsibilities, and decision-making context.",
    status: "Planned",
  },
  {
    title: "Hui",
    href: "/hui",
    eyebrow: "Meeting layer",
    description:
      "Record hui details, kaupapa, attendees, agendas, notes, and the source event for future decisions.",
    status: "Planned",
  },
  {
    title: "Minutes",
    href: "/minutes",
    eyebrow: "Record layer",
    description:
      "Capture formal notes, key kōrero, summaries, references, and evidence from each hui.",
    status: "Planned",
  },
  {
    title: "Decisions",
    href: "/decisions",
    eyebrow: "Outcome layer",
    description:
      "Log decisions made, who made them, what authority they came from, and what records support them.",
    status: "Planned",
  },
  {
    title: "Documents",
    href: "/documents",
    eyebrow: "Evidence layer",
    description:
      "Connect files, maps, reports, letters, claims, images, and supporting material to the right records.",
    status: "Planned",
  },
  {
    title: "Pānui",
    href: "/panui",
    eyebrow: "Communication layer",
    description:
      "Store notices, updates, announcements, and communication records so messaging is traceable.",
    status: "Planned",
  },
  {
    title: "Tasks",
    href: "/tasks",
    eyebrow: "Action layer",
    description:
      "Turn decisions into assigned actions with owners, due dates, status, and follow-up history.",
    status: "Planned",
  },
  {
    title: "Activity",
    href: "/activity",
    eyebrow: "Audit layer",
    description:
      "Track what happened across the system so every record has a visible chain of activity.",
    status: "Planned",
  },
];

const quickActions = [
  { label: "Record Hui", href: "/hui" },
  { label: "Add Decision", href: "/decisions" },
  { label: "Create Task", href: "/tasks" },
  { label: "Add Document", href: "/documents" },
];

const huiActions = [
  {
    title: "Confirm attendees",
    source: "Hui follow-up",
    status: "To do",
  },
  {
    title: "Attach minutes",
    source: "Meeting record",
    status: "Waiting",
  },
  {
    title: "Assign decision owner",
    source: "Decision flow",
    status: "To do",
  },
  {
    title: "Upload supporting document",
    source: "Evidence trail",
    status: "To do",
  },
];

const loggedActivity = [
  {
    action: "Whenua record created",
    record: "Kaikohe Aerodrome whenua record",
    user: "System user",
    time: "Just now",
    type: "Whenua",
  },
  {
    action: "Whakapapa relationship linked",
    record: "Person-to-person relationship",
    user: "System user",
    time: "Earlier today",
    type: "Whakapapa",
  },
  {
    action: "Person record added",
    record: "People Register",
    user: "System user",
    time: "Earlier today",
    type: "People",
  },
  {
    action: "Dashboard viewed",
    record: "Operations home",
    user: "System user",
    time: "Today",
    type: "Activity",
  },
];

function statusClass(status: string) {
  if (status === "Live") {
    return "bg-green-400/10 text-green-400";
  }

  if (status === "Next") {
    return "bg-stone-100 text-stone-950";
  }

  return "bg-stone-800 text-stone-500";
}

function activityTypeClass(type: string) {
  if (type === "Whenua") {
    return "bg-stone-100 text-stone-950";
  }

  if (type === "Whakapapa") {
    return "bg-green-400/10 text-green-400";
  }

  if (type === "People") {
    return "bg-white/10 text-white";
  }

  return "bg-stone-800 text-stone-400";
}

export default function HomePage() {
  return (
    <AppShell title="Dashboard" eyebrow="Sovereign Governance OS / Home">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-stone-700 bg-stone-950 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-stone-400">
                Operations home
              </p>

              <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                One place to manage records, decisions, actions, and evidence.
              </h1>

              <p className="mt-5 max-w-4xl text-base leading-8 text-stone-400">
                This system helps a hapū move from scattered kōrero, paper
                notes, group chats, and disconnected files into one relational
                operating system. A hui can produce minutes. Minutes can support
                a decision. A decision can create tasks. Tasks can attach
                documents. Activity keeps the chain visible.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    index === 0
                      ? "bg-stone-100 text-stone-950 hover:bg-white"
                      : "border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white"
                  }`}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-stone-800 bg-stone-800 md:grid-cols-2 xl:grid-cols-4">
          {coreModules.map((module) => (
            <a
              key={module.title}
              href={module.href}
              className="group min-h-[250px] bg-stone-900/80 p-6 transition hover:bg-stone-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
                    {module.eyebrow}
                  </p>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                    {module.title}
                  </h2>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] ${statusClass(
                    module.status
                  )}`}
                >
                  {module.status}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-stone-500">
                {module.description}
              </p>

              <div className="mt-8 text-sm font-semibold text-stone-600 transition group-hover:text-white">
                Open module →
              </div>
            </a>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <div className="flex flex-col gap-2 border-b border-stone-800 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Logged activity
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Recent actions across the system.
                </h2>
              </div>

              <a
                href="/activity"
                className="text-sm font-semibold text-stone-500 transition hover:text-white"
              >
                View activity log →
              </a>
            </div>

            <div className="mt-5 divide-y divide-stone-800 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950">
              {loggedActivity.map((item) => (
                <div
                  key={`${item.action}-${item.time}`}
                  className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_180px_120px]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-sm font-semibold text-white">
                        {item.action}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 font-mono text-[11px] ${activityTypeClass(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-stone-500">
                      {item.record}
                    </p>
                  </div>

                  <div className="text-sm text-stone-500">
                    Used by{" "}
                    <span className="font-semibold text-stone-300">
                      {item.user}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-stone-500 md:text-right">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  To do
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Hui actionables
                </h2>
              </div>

              <a
                href="/tasks"
                className="text-sm font-semibold text-stone-500 transition hover:text-white"
              >
                Tasks →
              </a>
            </div>

            <div className="mt-5 grid gap-3">
              {huiActions.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-stone-600">
                        {item.source}
                      </p>
                    </div>

                    <span className="rounded-full bg-stone-800 px-3 py-1 font-mono text-[11px] text-stone-400">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}