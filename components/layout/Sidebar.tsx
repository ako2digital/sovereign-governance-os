const navigation = [
  { name: "Dashboard", href: "/", group: "Overview" },
  { name: "People", href: "/people", group: "Core Records" },
  { name: "Whakapapa", href: "/whakapapa", group: "Core Records" },
  { name: "Whenua", href: "/whenua", group: "Core Records" },
  { name: "Marae", href: "/marae", group: "Governance" },
  { name: "Governance", href: "/governance", group: "Governance" },
  { name: "Hui", href: "/hui", group: "Governance" },
  { name: "Minutes", href: "/minutes", group: "Governance" },
  { name: "Decisions", href: "/decisions", group: "Governance" },
  { name: "Documents", href: "/documents", group: "Records" },
  { name: "Pānui", href: "/panui", group: "Records" },
  { name: "Tasks", href: "/tasks", group: "Records" },
  { name: "Activity", href: "/activity", group: "Records" },
];

const groups = ["Overview", "Core Records", "Governance", "Records"];

export default function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-stone-800 bg-stone-950/90 px-5 py-5 lg:block">
      <div className="mb-8 rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
          Sovereign OS
        </p>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">
          Hapū Relational Infrastructure
        </h1>

        <p className="mt-4 text-sm leading-6 text-stone-500">
          Records, relationships, governance, documents, actions, and future
          sovereignty layers.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            ["3", "Live"],
            ["12", "Modules"],
            ["RLS", "On"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-stone-800 bg-stone-950 p-3"
            >
              <div className="text-lg font-semibold text-white">{value}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-stone-600">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="space-y-6">
        {groups.map((group) => (
          <div key={group}>
            <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-600">
              {group}
            </p>

            <div className="space-y-1">
              {navigation
                .filter((item) => item.group === group)
                .map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center justify-between rounded-2xl px-3 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-white"
                  >
                    <span>{item.name}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-700 transition group-hover:bg-stone-100" />
                  </a>
                ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}