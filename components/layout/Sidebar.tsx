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
  
  export default function Sidebar() {
    return (
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
              className="block rounded-xl px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-stone-100"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </aside>
    );
  }
  