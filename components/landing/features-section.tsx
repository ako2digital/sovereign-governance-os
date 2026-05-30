const features = [
    {
      label: "People Registry",
      title: "A living register of people and relationships",
      description:
        "Manage people records that can later connect to whakapapa, whenua, hui, documents, decisions, tasks, and activity history.",
      href: "/people",
    },
    {
      label: "Whakapapa Layer",
      title: "Relationship records that connect people",
      description:
        "Create and view basic whakapapa relationships using Supabase relational data, joined back to people records.",
      href: "/whakapapa",
    },
    {
      label: "Whenua Records",
      title: "Land, place, and history records in one place",
      description:
        "Store whenua records with block names, locations, references, status, sensitivity, and historical notes.",
      href: "/whenua",
    },
    {
      label: "Governance Foundation",
      title: "A system that can grow into serious governance",
      description:
        "The current MVP keeps the data layer simple while preparing the structure for marae, governance, hui, minutes, decisions, documents, pānui, tasks, and audit history.",
      href: "/",
    },
  ];
  
  export function FeaturesSection() {
    return (
      <section
        id="features"
        className="relative overflow-hidden bg-stone-950 px-6 py-28 text-stone-100 lg:px-12"
      >
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 h-px w-full bg-stone-100/10" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-stone-100/10" />
          <div className="absolute left-1/4 top-0 h-full w-px bg-stone-100/10" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-stone-100/10" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-stone-100/10" />
        </div>
  
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="mb-16 max-w-3xl">
            <p className="mb-5 font-mono text-sm uppercase tracking-[0.3em] text-stone-500">
              MVP capability
            </p>
  
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              The first working layers of the system.
            </h2>
  
            <p className="mt-6 text-lg leading-8 text-stone-400">
              This is not the full sovereign infrastructure platform yet. It is
              the first working records layer: simple, live, connected, and ready
              to expand module by module.
            </p>
          </div>
  
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <a
                key={feature.title}
                href={feature.href}
                className="group relative min-h-[320px] overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60 p-8 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <div className="absolute right-6 top-6 font-mono text-sm text-stone-700">
                  0{index + 1}
                </div>
  
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
                      {feature.label}
                    </p>
  
                    <h3 className="mt-6 max-w-xl text-3xl font-semibold leading-tight text-white">
                      {feature.title}
                    </h3>
  
                    <p className="mt-5 max-w-xl text-base leading-7 text-stone-400">
                      {feature.description}
                    </p>
                  </div>
  
                  <div className="mt-10 inline-flex text-sm font-semibold text-stone-300 transition group-hover:text-white">
                    Open module →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }