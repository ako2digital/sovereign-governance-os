import AppShell from "@/components/layout/AppShell";

const modules = [
  {
    title: "People",
    href: "/people",
    eyebrow: "Core record",
    description: "Identity records for people connected to whakapapa, hui, tasks, roles, and activity.",
    status: "Live",
  },
  {
    title: "Whakapapa",
    href: "/whakapapa",
    eyebrow: "Relationship record",
    description: "Person-to-person relationships that stop records sitting as disconnected entries.",
    status: "Live",
  },
  {
    title: "Whenua",
    href: "/whenua",
    eyebrow: "Land record",
    description: "Land, block, location, legal description, historical notes, and reference records.",
    status: "Live",
  },
  {
    title: "Marae",
    href: "/marae",
    eyebrow: "Community record",
    description: "Marae records connected to people, whenua, hui, documents, and governance activity.",
    status: "Live",
  },
  {
    title: "Governance",
    href: "/governance",
    eyebrow: "Authority record",
    description: "Mandates, policy, authority, structures, responsibilities, and decision context.",
    status: "Live",
  },
  {
    title: "Hui",
    href: "/hui",
    eyebrow: "Meeting record",
    description: "Capture hui, attendees, kaupapa, notes, decisions, and follow-up actions.",
    status: "Next",
  },
  {
    title: "Minutes",
    href: "/minutes",
    eyebrow: "Meeting notes",
    description: "Formal records of kōrero, summaries, references, and meeting outcomes.",
    status: "Planned",
  },
  {
    title: "Decisions",
    href: "/decisions",
    eyebrow: "Outcome record",
    description: "Decisions made, where they came from, who approved them, and what they trigger.",
    status: "Planned",
  },
  {
    title: "Documents",
    href: "/documents",
    eyebrow: "Evidence record",
    description: "Files, maps, reports, letters, images, and evidence attached to the right records.",
    status: "Planned",
  },
  {
    title: "Pānui",
    href: "/panui",
    eyebrow: "Communication record",
    description: "Notices, updates, announcements, and communication history.",
    status: "Planned",
  },
  {
    title: "Tasks",
    href: "/tasks",
    eyebrow: "Action record",
    description: "Follow-up actions from hui, decisions, documents, and governance work.",
    status: "Planned",
  },
  {
    title: "Activity",
    href: "/activity",
    eyebrow: "Audit record",
    description: "A visible trail of what happened, who acted, and what record was affected.",
    status: "Planned",
  },
];

const relatedRecordExamples = [
  {
    label: "Governance",
    value: "Data Management Mandate",
    href: "/governance",
  },
  {
    label: "Related Marae",
    value: "Linked marae record",
    href: "/marae",
  },
  {
    label: "Related Whenua",
    value: "Linked whenua record",
    href: "/whenua",
  },
  {
    label: "Related Decision",
    value: "Awaiting decision record",
    href: "/decisions",
  },
];

const actionables = [
  {
    title: "Confirm hui attendees",
    source: "Hui follow-up",
    status: "To do",
  },
  {
    title: "Attach signed minutes",
    source: "Minutes record",
    status: "Waiting",
  },
  {
    title: "Assign decision owner",
    source: "Decision flow",
    status: "To do",
  },
  {
    title: "Upload supporting evidence",
    source: "Document trail",
    status: "To do",
  },
];

const loggedActivity = [
  {
    action: "Governance record viewed",
    record: "Data Management Mandate",
    user: "System user",
    time: "Just now",
    type: "Governance",
  },
  {
    action: "Marae record created",
    record: "Community layer",
    user: "System user",
    time: "Today",
    type: "Marae",
  },
  {
    action: "Whenua record updated",
    record: "Land record layer",
    user: "System user",
    time: "Today",
    type: "Whenua",
  },
  {
    action: "Whakapapa link opened",
    record: "Relationship layer",
    user: "System user",
    time: "Earlier",
    type: "Whakapapa",
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
  if (type === "Governance") {
    return "bg-stone-100 text-stone-950";
  }

  if (type === "Marae") {
    return "bg-green-400/10 text-green-400";
  }

  if (type === "Whenua") {
    return "bg-white/10 text-white";
  }

  return "bg-stone-800 text-stone-400";
}

export default function HomePage() {
  return (
    <AppShell title="Dashboard" eyebrow="Sovereign Governance OS / Home">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <a
                href="/"
                className="inline-flex rounded-full border border-stone-700 bg-stone-950 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-stone-400 transition hover:border-stone-500 hover:text-white"
              >
                Operations home
              </a>

              <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                A relational home for records, authority, decisions, and follow-up actions.
              </h1>

              <p className="mt-5 max-w-4xl text-base leading-8 text-stone-400">
                This app keeps the chain visible: people connect to whakapapa, whenua connects to evidence,
                hui creates decisions, decisions create tasks, and activity records what happened.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px]">
              <a
                href="/hui"
                className="rounded-2xl bg-stone-100 px-5 py-4 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Record Hui
              </a>

              <a
                href="/governance/new"
                className="rounded-2xl border border-stone-700 px-5 py-4 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Add Governance
              </a>

              <a
                href="/tasks"
                className="rounded-2xl border border-stone-700 px-5 py-4 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                View Tasks
              </a>

              <a
                href="/activity"
                className="rounded-2xl border border-stone-700 px-5 py-4 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Activity Log
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-stone-800 bg-stone-800 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <a
              key={module.title}
              href={module.href}
              className="group min-h-[230px] bg-stone-900/80 p-6 transition hover:bg-stone-900"
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

              <div className="mt-7 text-sm font-semibold text-stone-600 transition group-hover:text-white">
                Open module →
              </div>
            </a>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <div className="border-b border-stone-800 pb-5">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Related records
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Records should connect, not sit alone.
              </h2>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {relatedRecordExamples.map((record) => (
                <a
                  key={record.label}
                  href={record.href}
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-5 transition hover:border-stone-600 hover:bg-stone-900"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    {record.label}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-stone-200">
                    {record.value}
                  </p>
                </a>
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
                  Actionables
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
              {actionables.map((item) => (
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

                  <p className="mt-2 text-sm text-stone-500">{item.record}</p>
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
      </section>
    </AppShell>
  );
}