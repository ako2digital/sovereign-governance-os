import AppShell from "@/components/layout/AppShell";

const readinessChecks = [
  {
    section: "App Readiness",
    items: [
      "Dashboard loads and shows live record counts.",
      "System Overview explains the MVP clearly.",
      "Demo Flow gives a clean presentation sequence.",
      "Feedback page gives structured review questions.",
      "All module register pages load without database errors.",
      "All detail pages open correctly.",
      "All create forms load correctly.",
      "Related-record links work where IDs exist.",
    ],
  },
  {
    section: "Demo Data Readiness",
    items: [
      "People records include clean demo names.",
      "Whakapapa has at least one relationship between two people.",
      "Whenua record is linked to governance, hui, documents, pānui, and tasks.",
      "Marae record is linked to governance, hui, documents, and pānui.",
      "Governance record is linked to whenua and marae.",
      "Hui record is linked to governance, whenua, and marae.",
      "Minutes record is linked to hui.",
      "Decision record is linked to hui and minutes.",
      "Document record is linked across the demo chain.",
      "Task record is assigned to a person and linked to related records.",
    ],
  },
  {
    section: "Kōrero Readiness",
    items: [
      "Open by explaining the current problem: scattered records and weak continuity.",
      "Explain that the MVP is a working shell, not the final system.",
      "Explain that no sensitive real data needs to be entered yet.",
      "Explain that access rules, tikanga, and terminology must be shaped by hapū input.",
      "Explain that the next step is a working group, not full rollout.",
      "Avoid overpromising blockchain, AI, or full whakapapa functionality at this stage.",
    ],
  },
  {
    section: "Meeting Readiness",
    items: [
      "Laptop charged.",
      "Internet connection tested.",
      "Local app running before the meeting starts.",
      "Supabase project accessible if needed.",
      "Demo route tested from System Overview through Feedback.",
      "Screenshots/proof trail available if asked.",
      "GitHub repository pushed and clean.",
      "Backup explanation ready if live demo fails.",
    ],
  },
];

const demoOrder = [
  "System Overview",
  "Dashboard",
  "Demo Flow",
  "People",
  "Whakapapa",
  "Whenua",
  "Marae",
  "Governance",
  "Hui",
  "Minutes",
  "Decisions",
  "Documents",
  "Pānui",
  "Tasks",
  "Activity",
  "Feedback",
];

const doNotPromise = [
  "Do not say this is the final hapū system.",
  "Do not say sensitive whakapapa should be entered now.",
  "Do not say access control is complete.",
  "Do not say tikanga-based permissions are complete.",
  "Do not say blockchain or sovereign wallet access is part of the current MVP.",
  "Do not say the system is production-ready.",
];

export default function PresentationChecklistPage() {
  return (
    <AppShell title="Presentation Checklist" eyebrow="Demo Readiness">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Hapū Presentation
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Presentation Checklist
        </h1>

        <p className="mt-4 max-w-3xl text-stone-400">
          Use this page before the hapū meeting to confirm the app, demo data,
          kōrero, and presentation flow are ready. This page is an operational
          checklist for the MVP demonstration.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Demo Position
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Working MVP Shell
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Present this as a visual and functional starting point for feedback.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Main Ask
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Form Working Group
          </p>
          <p className="mt-2 text-sm text-stone-400">
            The next decision is whether to test and shape the pilot properly.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Risk Control
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            No Sensitive Data Yet
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Keep the demo focused on structure, not live sensitive records.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Readiness Checklist
        </h2>

        <p className="mt-1 text-sm text-stone-400">
          Work through each section before the presentation.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {readinessChecks.map((group) => (
            <div
              key={group.section}
              className="rounded-2xl border border-stone-800 bg-stone-950 p-5"
            >
              <h3 className="font-semibold text-white">{group.section}</h3>

              <div className="mt-5 grid gap-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-stone-800 bg-stone-900 p-4"
                  >
                    <p className="text-sm leading-6 text-stone-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Recommended Demo Order
          </h2>

          <p className="mt-1 text-sm text-stone-400">
            Follow this order to keep the presentation controlled.
          </p>

          <div className="mt-6 grid gap-3">
            {demoOrder.map((item, index) => (
              <div
                key={item}
                className="grid grid-cols-[48px_1fr] items-center gap-3 rounded-xl border border-stone-800 bg-stone-950 p-4"
              >
                <p className="text-sm font-semibold text-stone-500">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-sm font-medium text-stone-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Do Not Overpromise
          </h2>

          <p className="mt-1 text-sm text-stone-400">
            Keep the MVP positioned correctly.
          </p>

          <div className="mt-6 grid gap-3">
            {doNotPromise.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4"
              >
                <p className="text-sm leading-6 text-stone-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Backup Explanation If Live Demo Fails
        </h2>

        <p className="mt-4 max-w-4xl text-sm leading-6 text-stone-400">
          This is a live MVP build, so the important point is not one screen or
          one technical feature. The important point is the system structure:
          records can be centralised, connected, reviewed, and improved through a
          controlled hapū-led process. If the live app has a technical issue, the
          proof trail and screenshots still show the build progress and working
          modules.
        </p>
      </section>
    </AppShell>
  );
}