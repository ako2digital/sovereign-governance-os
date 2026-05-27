import AppShell from "@/components/layout/AppShell";

export default function PeoplePage() {
  return (
    <AppShell title="People" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          MVP Module
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          People
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage people connected to whakapapa, whenua, hui, documents, decisions, tasks, and activity history.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">No people records yet</h2>
        <p className="mt-2 text-sm text-stone-400">
          Add the first person to begin building the relational record base.
        </p>
      </section>
    </AppShell>
  );
}
