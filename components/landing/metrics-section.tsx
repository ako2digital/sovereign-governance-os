const metrics = [
    {
      value: "3",
      label: "Active modules",
      description: "People, whakapapa, and whenua are already reading and writing live Supabase data.",
    },
    {
      value: "12",
      label: "Core MVP modules",
      description: "The full MVP structure includes records, governance, hui, documents, decisions, pānui, tasks, and activity.",
    },
    {
      value: "RLS",
      label: "Security layer enabled",
      description: "Row Level Security is active, with temporary MVP policies used only for local development proof.",
    },
    {
      value: "Live",
      label: "Database connection",
      description: "The Next.js app is connected to Supabase and displaying live relational records.",
    },
  ];
  
  export function MetricsSection() {
    return (
      <section
        id="metrics"
        className="relative overflow-hidden bg-stone-100 px-6 py-24 text-stone-950 lg:px-12 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 max-w-3xl">
            <p className="mb-5 font-mono text-sm uppercase tracking-[0.3em] text-stone-500">
              Build proof
            </p>
  
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Every layer must prove itself before the next one is added.
            </h2>
  
            <p className="mt-6 text-lg leading-8 text-stone-600">
              The MVP is being built through visible, testable proof: a page,
              a table, a create form, a live record, and a committed step for each
              module.
            </p>
          </div>
  
          <div className="grid gap-px overflow-hidden rounded-3xl border border-stone-300 bg-stone-300 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="min-h-[320px] bg-stone-100 p-8 transition hover:bg-white"
              >
                <div className="text-5xl font-semibold tracking-tight md:text-6xl">
                  {metric.value}
                </div>
  
                <h3 className="mt-8 text-xl font-semibold">{metric.label}</h3>
  
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }