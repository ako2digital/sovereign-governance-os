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
    <aside className="hidden w-72 shrink-0 border-r border-stone-800 bg-stone-950/90 px-5 py-5 lg:block">
      <a
        href="/"
        className="mb-8 flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/50 px-4 py-4 transition hover:border-stone-700 hover:bg-stone-900"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
            Sovereign OS
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            MVP Command
          </p>
        </div>

        <span className="rounded-full bg-green-400/10 px-3 py-1 font-mono text-[11px] text-green-400">
          Live
        </span>
      </a>

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