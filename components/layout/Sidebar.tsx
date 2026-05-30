const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    section: "System",
  },
  {
    label: "System Overview",
    href: "/system-overview",
    section: "System",
  },
  {
    label: "Demo Flow",
    href: "/demo-flow",
    section: "System",
  },
  {
    label: "People",
    href: "/people",
    section: "Core Records",
  },
  {
    label: "Whakapapa",
    href: "/whakapapa",
    section: "Core Records",
  },
  {
    label: "Whenua",
    href: "/whenua",
    section: "Core Records",
  },
  {
    label: "Marae",
    href: "/marae",
    section: "Core Records",
  },
  {
    label: "Governance",
    href: "/governance",
    section: "Governance",
  },
  {
    label: "Hui",
    href: "/hui",
    section: "Governance",
  },
  {
    label: "Minutes",
    href: "/minutes",
    section: "Governance",
  },
  {
    label: "Decisions",
    href: "/decisions",
    section: "Governance",
  },
  {
    label: "Documents",
    href: "/documents",
    section: "Operations",
  },
  {
    label: "Pānui",
    href: "/panui",
    section: "Operations",
  },
  {
    label: "Tasks",
    href: "/tasks",
    section: "Operations",
  },
  {
    label: "Activity",
    href: "/activity",
    section: "System",
  },
];

const groupedNavigation = navigationItems.reduce<Record<string, typeof navigationItems>>(
  (groups, item) => {
    if (!groups[item.section]) {
      groups[item.section] = [];
    }

    groups[item.section].push(item);
    return groups;
  },
  {}
);

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-stone-800 bg-stone-950 p-6 lg:block">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Sovereign OS
        </p>

        <h1 className="mt-3 text-xl font-semibold text-white">
          Hapū Platform
        </h1>

        <p className="mt-2 text-sm text-stone-500">
          Relational infrastructure for records, governance, and operations.
        </p>
      </div>

      <nav className="mt-8 grid gap-7">
        {Object.entries(groupedNavigation).map(([section, items]) => (
          <div key={section}>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-600">
              {section}
            </p>

            <div className="grid gap-1">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-stone-400 transition hover:bg-stone-900 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}