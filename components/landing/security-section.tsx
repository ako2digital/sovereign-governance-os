const securityItems = [
    {
      title: "Row Level Security enabled",
      description:
        "Supabase RLS is active from the start, so the system is being built with security boundaries in mind instead of added later.",
    },
    {
      title: "Temporary MVP policies",
      description:
        "Open development policies are only being used to prove local read and create flows. They will be replaced with proper role-based access.",
    },
    {
      title: "Sensitive record awareness",
      description:
        "Whakapapa, whenua, marae, governance, and document records require different levels of visibility, sensitivity, and control.",
    },
    {
      title: "Future tikanga access layer",
      description:
        "The long-term system can evolve beyond technical permissions into authority-aware access based on role, relationship, mandate, and context.",
    },
  ];
  
  export function SecuritySection() {
    return (
      <section
        id="security"
        className="relative overflow-hidden bg-stone-950 px-6 py-24 text-stone-100 lg:px-12 lg:py-32"
      >
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 h-px w-full bg-stone-100/10" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-stone-100/10" />
        </div>
  
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="mb-5 font-mono text-sm uppercase tracking-[0.3em] text-stone-500">
                Security posture
              </p>
  
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Access must be designed before the system scales.
              </h2>
  
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone-400">
                This MVP is not pretending to solve full sovereignty, identity,
                or tikanga-based access yet. It is laying the technical foundation
                carefully: database first, RLS enabled, policies visible, and
                access control planned before sensitive deployment.
              </p>
            </div>
  
            <div className="grid gap-4">
              {securityItems.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-stone-800 bg-stone-900/60 p-7 transition hover:border-stone-600 hover:bg-stone-900"
                >
                  <div className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-700 font-mono text-sm text-stone-400">
                      {index + 1}
                    </div>
  
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {item.title}
                      </h3>
  
                      <p className="mt-3 text-sm leading-7 text-stone-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="mt-16 rounded-3xl border border-stone-800 bg-stone-900/40 p-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
              Current security state
            </p>
  
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                ["RLS", "Enabled"],
                ["Auth", "Future step"],
                ["Roles", "Future step"],
                ["Policies", "MVP temporary"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-5"
                >
                  <div className="font-mono text-xs text-stone-500">{label}</div>
                  <div className="mt-3 text-lg font-semibold text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }