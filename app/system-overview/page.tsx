import AppShell from "@/components/layout/AppShell";

const modules = [
  {
    name: "People Registry",
    purpose: "Stores individual people records and basic profile information.",
  },
  {
    name: "Whakapapa Relationships",
    purpose: "Connects people through relationship records and notes.",
  },
  {
    name: "Whenua Records",
    purpose: "Tracks land blocks, locations, legal references, and whenua notes.",
  },
  {
    name: "Marae Records",
    purpose: "Stores marae names, locations, and operational status.",
  },
  {
    name: "Governance Records",
    purpose: "Tracks kaupapa, mandates, agreements, and governance items.",
  },
  {
    name: "Hui Records",
    purpose: "Stores meeting records, agendas, purposes, dates, and related records.",
  },
  {
    name: "Minutes",
    purpose: "Stores hui minutes, summaries, approval status, and full notes.",
  },
  {
    name: "Decisions",
    purpose: "Tracks formal decisions connected to hui and minutes.",
  },
  {
    name: "Documents",
    purpose: "Registers files, references, and related people or kaupapa records.",
  },
  {
    name: "Pānui",
    purpose: "Manages notices, announcements, updates, and communication records.",
  },
  {
    name: "Tasks",
    purpose: "Tracks actions, priorities, assignments, deadlines, and related records.",
  },
  {
    name: "Activity Log",
    purpose: "Provides a foundation for system activity tracking and audit history.",
  },
];

export default function SystemOverviewPage() {
  return (
    <AppShell title="System Overview" eyebrow="Demo Readiness">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Hapū Data System
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          System Overview
        </h1>

        <p className="mt-4 max-w-3xl text-stone-400">
          This platform is a working MVP for managing hapū records, relationships,
          whenua information, hui, decisions, documents, pānui, and operational
          tasks in one connected system.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Current Stage
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">MVP Shell</p>
          <p className="mt-2 text-sm text-stone-400">
            The core system is live enough to demonstrate structure, navigation,
            records, and relational flow.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Primary Purpose
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            Data Management
          </p>
          <p className="mt-2 text-sm text-stone-400">
            The system gives hapū a central place to store, connect, and manage
            important operational records.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Build Status
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">Active</p>
          <p className="mt-2 text-sm text-stone-400">
            Register pages, create forms, detail pages, and related-record links
            are already working.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Problem This System Solves
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <h3 className="font-semibold text-white">Current Problem</h3>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              Hapū information can become scattered across books, paper records,
              personal devices, emails, conversations, folders, and memory. This
              makes it difficult to confirm what exists, who holds it, what is
              current, and what needs action.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <h3 className="font-semibold text-white">MVP Solution</h3>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              This MVP creates a single structured digital system where core
              records can be entered, viewed, linked, and improved over time.
              The aim is not to replace tikanga or people. The aim is to support
              better visibility, continuity, and operational control.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Current MVP Modules
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              These modules are already represented in the working app.
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-stone-500 hover:text-white"
          >
            Open Dashboard
          </a>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module.name}
              className="rounded-2xl border border-stone-800 bg-stone-950 p-5"
            >
              <h3 className="font-semibold text-white">{module.name}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                {module.purpose}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            What Is Included Now
          </h2>

          <div className="mt-5 grid gap-3 text-sm text-stone-400">
            <p>Register pages for all core MVP modules.</p>
            <p>Create forms for adding new operational records.</p>
            <p>Detail pages for viewing individual records.</p>
            <p>Related-record links between connected modules.</p>
            <p>Dashboard with live module counts and system status.</p>
            <p>Proof trail showing build progress and working features.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            What Is Not Included Yet
          </h2>

          <div className="mt-5 grid gap-3 text-sm text-stone-400">
            <p>Full authentication and role-based access control.</p>
            <p>Tikanga-based permission rules.</p>
            <p>Full whakapapa engine or sensitive whakapapa governance.</p>
            <p>Automated activity logging for every system action.</p>
            <p>File upload storage and document vault controls.</p>
            <p>Blockchain, digital identity, or sovereign wallet access.</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Proposed Next Steps After Hapū Feedback
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Step 1
            </p>
            <h3 className="mt-3 font-semibold text-white">
              Confirm Data Needs
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Identify what records the hapū actually wants to manage first,
              what is sensitive, and what should remain offline or restricted.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Step 2
            </p>
            <h3 className="mt-3 font-semibold text-white">
              Form Working Group
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Create a small group to test the system, review terminology, define
              access rules, and decide what changes are required.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Step 3
            </p>
            <h3 className="mt-3 font-semibold text-white">
              Build Controlled Pilot
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Move from MVP shell to a controlled pilot with proper access,
              real records, security rules, and hapū-approved workflows.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}