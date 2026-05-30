const footerLinks = [
    {
      title: "Core modules",
      links: [
        { name: "People", href: "/people" },
        { name: "Whakapapa", href: "/whakapapa" },
        { name: "Whenua", href: "/whenua" },
        { name: "Marae", href: "/marae" },
      ],
    },
    {
      title: "Governance",
      links: [
        { name: "Governance", href: "/governance" },
        { name: "Hui", href: "/hui" },
        { name: "Minutes", href: "/minutes" },
        { name: "Decisions", href: "/decisions" },
      ],
    },
    {
      title: "Records",
      links: [
        { name: "Documents", href: "/documents" },
        { name: "Pānui", href: "/panui" },
        { name: "Tasks", href: "/tasks" },
        { name: "Activity", href: "/activity" },
      ],
    },
  ];
  
  export function FooterSection() {
    return (
      <footer className="relative overflow-hidden bg-stone-950 px-6 py-16 text-stone-100 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 border-b border-stone-800 pb-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <a href="/design-test" className="inline-flex items-center gap-2">
                <span className="text-2xl font-semibold tracking-tight">
                  Sovereign OS
                </span>
                <span className="font-mono text-xs text-stone-500">MVP</span>
              </a>
  
              <p className="mt-5 max-w-xl text-sm leading-7 text-stone-400">
                A working relational infrastructure layer for hapū records:
                people, whakapapa, whenua, marae, governance, hui, documents,
                decisions, pānui, tasks, and activity history.
              </p>
            </div>
  
            <div className="grid gap-8 sm:grid-cols-3">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
                    {group.title}
                  </h3>
  
                  <div className="mt-5 grid gap-3">
                    {group.links.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="text-sm text-stone-400 transition hover:text-white"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="flex flex-col gap-4 pt-8 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
            <p>Built as a module-by-module MVP proof.</p>
  
            <div className="flex gap-5">
              <a href="/" className="transition hover:text-stone-300">
                Dashboard
              </a>
              <a href="/design-test" className="transition hover:text-stone-300">
                Design preview
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }