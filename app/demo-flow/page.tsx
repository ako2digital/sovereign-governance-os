import AppShell from "@/components/layout/AppShell";

const demoSteps = [
  {
    number: "01",
    title: "Open System Overview",
    href: "/system-overview",
    purpose:
      "Start by explaining the problem, the MVP purpose, what is included now, what is excluded, and what feedback is needed.",
  },
  {
    number: "02",
    title: "Open Dashboard",
    href: "/",
    purpose:
      "Show the live command centre with total records, active modules, system status, and direct access to each module.",
  },
  {
    number: "03",
    title: "Show People Registry",
    href: "/people",
    purpose:
      "Demonstrate individual people records and how a person profile can become the anchor for related records.",
  },
  {
    number: "04",
    title: "Show Whakapapa Relationships",
    href: "/whakapapa",
    purpose:
      "Show how people can be connected through relationship records, while keeping deeper whakapapa governance for a later stage.",
  },
  {
    number: "05",
    title: "Show Whenua and Marae Records",
    href: "/whenua",
    purpose:
      "Show how whenua and marae records can be stored as operational reference points for governance, hui, documents, pānui, and tasks.",
  },
  {
    number: "06",
    title: "Show Governance Records",
    href: "/governance",
    purpose:
      "Show how mandates, agreements, kaupapa, and governance records can link back to whenua and marae.",
  },
  {
    number: "07",
    title: "Show Hui, Minutes, and Decisions",
    href: "/hui",
    purpose:
      "Show how hui records connect to minutes and decisions, creating a traceable governance flow.",
  },
  {
    number: "08",
    title: "Show Documents",
    href: "/documents",
    purpose:
      "Show how documents can be registered and linked to people, whenua, marae, hui, and decisions.",
  },
  {
    number: "09",
    title: "Show Pānui",
    href: "/panui",
    purpose:
      "Show how notices and communications can be connected to marae, whenua, and hui records.",
  },
  {
    number: "10",
    title: "Show Tasks",
    href: "/tasks",
    purpose:
      "Show how actions can be assigned to people and linked to hui, decisions, documents, and whenua records.",
  },
  {
    number: "11",
    title: "Show Activity Log",
    href: "/activity",
    purpose:
      "Explain that activity tracking is currently a foundation layer and will later support stronger audit history.",
  },
];

const feedbackQuestions = [
  "What records does the hapū need to manage first?",
  "Which records are safe for a basic pilot, and which should remain restricted or offline?",
  "Who should be allowed to view, create, edit, or approve different types of records?",
  "What terminology should be changed to match hapū language and tikanga?",
  "What workflows are missing from the MVP shell?",
  "Who should join the working group to test and guide the next version?",
];

export default function DemoFlowPage() {
  return (
    <AppShell title="Demo Flow" eyebrow="Presentation Readiness">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Hapū Presentation Guide
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Demo Flow
        </h1>

        <p className="mt-4 max-w-3xl text-stone-400">
          Use this page as the presentation sequence for demonstrating the MVP.
          It keeps the kōrero focused: problem, system overview, connected
          record chain, feedback, and next steps.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Demo Goal
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Show the Shell
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Demonstrate a working structure, not a final production system.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Main Message
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Connected Records
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Show how hapū records can connect instead of remaining scattered.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Outcome Needed
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Feedback
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Gather guidance before any real sensitive records are entered.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Presentation Sequence
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Follow this order during the hapū demonstration.
            </p>
          </div>

          <a
            href="/system-overview"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-stone-500 hover:text-white"
          >
            Start Demo
          </a>
        </div>

        <div className="mt-6 grid gap-4">
          {demoSteps.map((step) => (
            <a
              key={step.number}
              href={step.href}
              className="rounded-2xl border border-stone-800 bg-stone-950 p-5 transition hover:border-stone-600 hover:bg-stone-900"
            >
              <div className="grid gap-4 md:grid-cols-[80px_1fr_auto] md:items-center">
                <div className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-center">
                  <p className="text-lg font-semibold text-white">
                    {step.number}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">
                    {step.purpose}
                  </p>
                </div>

                <p className="text-sm font-medium text-stone-300">
                  Open →
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Connected Demo Chain
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-400">
            During the walkthrough, show one clean seeded chain from people to
            whakapapa, whenua, marae, governance, hui, minutes, decisions,
            documents, pānui, and tasks.
          </p>

          <div className="mt-5 grid gap-3 text-sm text-stone-400">
            <p>People → individual profiles.</p>
            <p>Whakapapa → links people together.</p>
            <p>Whenua / Marae → anchor place-based records.</p>
            <p>Governance → links mandate to whenua and marae.</p>
            <p>Hui → links meeting to governance, whenua, and marae.</p>
            <p>Minutes / Decisions → creates traceable governance history.</p>
            <p>Documents / Pānui / Tasks → supports operations and follow-up.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Feedback Questions
          </h2>

          <div className="mt-5 grid gap-3">
            {feedbackQuestions.map((question) => (
              <div
                key={question}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4"
              >
                <p className="text-sm leading-6 text-stone-300">{question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Closing Position
        </h2>

        <p className="mt-4 max-w-4xl text-sm leading-6 text-stone-400">
          This MVP is not being presented as the final hapū system. It is a
          working visual shell to help the hapū see what a structured data
          management system could look like. The next decision is not whether to
          put all records into the system immediately. The next decision is
          whether to form a working group, define the correct data rules, and
          shape a controlled pilot.
        </p>
      </section>
    </AppShell>
  );
}