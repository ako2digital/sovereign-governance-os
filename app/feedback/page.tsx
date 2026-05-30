import AppShell from "@/components/layout/AppShell";

const feedbackSections = [
  {
    title: "Data Priorities",
    description:
      "Clarify which records the hapū should manage first before expanding the system.",
    questions: [
      "What information is currently most scattered or difficult to find?",
      "Which records should be digitised first?",
      "Which records are important but not urgent?",
      "Which records should stay outside the system for now?",
    ],
  },
  {
    title: "Sensitivity and Access",
    description:
      "Identify what needs protection before any real sensitive data is entered.",
    questions: [
      "Which records are public, internal, restricted, or highly sensitive?",
      "Who should be allowed to view each type of record?",
      "Who should be allowed to create or update records?",
      "Who should approve sensitive records before they are saved?",
    ],
  },
  {
    title: "Tikanga and Language",
    description:
      "Make sure the system reflects hapū terminology, tikanga, and authority structures.",
    questions: [
      "What wording in the app needs to change?",
      "Are the module names correct?",
      "Are there tikanga rules that should control access or visibility?",
      "Who has authority to define these rules?",
    ],
  },
  {
    title: "Workflow Gaps",
    description:
      "Find what is missing from the current MVP shell before moving into pilot build.",
    questions: [
      "What process does the hapū currently follow for hui, minutes, and decisions?",
      "What follow-up actions usually get missed?",
      "What reports or exports would be useful?",
      "What would make this system easier for whānau or committee members to use?",
    ],
  },
  {
    title: "Working Group",
    description:
      "Confirm who should test, review, and guide the next version of the system.",
    questions: [
      "Who should be part of the working group?",
      "Who understands the records and history?",
      "Who understands governance and decision-making?",
      "Who should test the system before real records are entered?",
    ],
  },
];

export default function FeedbackPage() {
  return (
    <AppShell title="Feedback" eyebrow="Hapū Review">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Hapū Feedback Capture
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Feedback Questions
        </h1>

        <p className="mt-4 max-w-3xl text-stone-400">
          Use this page during or after the MVP demonstration to capture the
          kōrero that matters before moving into a controlled pilot. This is not
          a data-entry form yet. It is a structured guide for deciding what the
          next version must protect, include, and improve.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Current Stage
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Feedback Only
          </p>
          <p className="mt-2 text-sm text-stone-400">
            This page is for discussion, not permanent feedback storage yet.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Main Purpose
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Shape the Pilot
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Feedback should define what gets built, restricted, renamed, or
            delayed.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Next Decision
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Working Group
          </p>
          <p className="mt-2 text-sm text-stone-400">
            The next serious step is a small group to review and guide the pilot.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Feedback Areas
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Work through each section and record answers outside the app until
              the hapū agrees on the proper feedback workflow.
            </p>
          </div>

          <a
            href="/demo-flow"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-stone-500 hover:text-white"
          >
            Back to Demo Flow
          </a>
        </div>

        <div className="mt-6 grid gap-4">
          {feedbackSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-stone-800 bg-stone-950 p-6"
            >
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">
                {section.description}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {section.questions.map((question) => (
                  <div
                    key={question}
                    className="rounded-xl border border-stone-800 bg-stone-900 p-4"
                  >
                    <p className="text-sm leading-6 text-stone-300">
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Recommended Closing Question
        </h2>

        <p className="mt-4 max-w-4xl text-sm leading-6 text-stone-400">
          Based on what you have seen, should we form a small hapū working group
          to define the real data needs, access rules, terminology, sensitive
          record boundaries, and pilot workflow before any live sensitive data is
          entered?
        </p>
      </section>
    </AppShell>
  );
}