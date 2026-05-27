import AppShell from "@/components/layout/AppShell";

export default function DocumentsPage() {
  return (
    <AppShell title="Documents" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          MVP Module
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Documents
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Store document records and connect them to people, whakapapa, whenua, marae, hui, and decisions.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">No documents yet</h2>
        <p className="mt-2 text-sm text-stone-400">
          Add a document record and connect it to people, whenua, hui, decisions, or governance records.
        </p>
      </section>
    </AppShell>
  );
}
