import AppShell from "@/components/layout/AppShell";

export default function WhenuaPage() {
  return (
    <AppShell title="Whenua" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          MVP Module
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Whenua
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Organise whenua records, land references, historical notes, documents, hui, decisions, and tasks.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">No whenua records yet</h2>
        <p className="mt-2 text-sm text-stone-400">
          Add a whenua record to begin organising land, place, or history information.
        </p>
      </section>
    </AppShell>
  );
}
