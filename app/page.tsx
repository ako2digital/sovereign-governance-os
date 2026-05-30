import AppShell from "@/components/layout/AppShell";

const moduleCards = [
  {
    title: "People Register",
    description:
      "The base register for whānau, members, contacts, and identity-linked records.",
    href: "/people",
    status: "Live",
  },
  {
    title: "Whakapapa",
    description:
      "Relational records connecting people through structured whakapapa links.",
    href: "/whakapapa",
    status: "Live",
  },
  {
    title: "Whenua",
    description:
      "Land, block, history, and whenua-related records connected to the wider system.",
    href: "/whenua",
    status: "Live",
  },
  {
    title: "Marae",
    description:
      "Marae records, contacts, governance links, and future operational data.",
    href: "/marae",
    status: "Next",
  },
  {
    title: "Governance",
    description:
      "Mandates, roles, hui structures, decisions, documents, and authority records.",
    href: "/governance",
    status: "Planned",
  },
  {
    title: "Documents",
    description:
      "Evidence, files, minutes, records, and future archival storage pathways.",
    href: "/documents",
    status: "Planned",
  },
];

const proofItems = [
  "Next.js app shell operational",
  "Supabase connected",
  "People module reads and creates records",
  "Whakapapa module reads and creates relationships",
  "Whenua module reads and creates records",
  "RLS enabled with temporary MVP policies",
];

export default function HomePage() {
  return (
    <AppShell
      title="Sovereign Governance OS"
      eyebrow="Dashboard / MVP Command Layer"
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            30-Day Build Sprint
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Relational infrastructure for hapū records, governance, and future
            sovereignty layers.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-400">
            This MVP is being built module by module. The current working layer
            proves the core pattern: create the table, connect Supabase, build
            the page, create the form, test the flow, then commit the proof.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/people"
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open People Register
            </a>

            <a
              href="/design-test"
              className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View Design Preview
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-800 bg-stone-900/40 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Current proof
          </p>

          <div className="mt-6 grid gap-3">
            {proofItems.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3 text-sm text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-stone-800 bg-stone-800 md:grid-cols-2 xl:grid-cols-3">
        {moduleCards.map((module) => (
          <a
            key={module.title}
            href={module.href}
            className="group min-h-[260px] bg-stone-900/70 p-7 transition hover:bg-stone-900"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {module.title}
              </h2>

              <span
                className={`rounded-full px-3 py-1 font-mono text-xs ${
                  module.status === "Live"
                    ? "bg-green-400/10 text-green-400"
                    : module.status === "Next"
                    ? "bg-stone-100/10 text-stone-300"
                    : "bg-stone-800 text-stone-500"
                }`}
              >
                {module.status}
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-stone-400">
              {module.description}
            </p>

            <div className="mt-8 text-sm font-semibold text-stone-500 transition group-hover:text-white">
              Open module →
            </div>
          </a>
        ))}
      </section>
    </AppShell>
  );
}