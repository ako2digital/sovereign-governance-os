import AppShell from "@/components/layout/AppShell";

export default function GovernancePage() {
  return (
    <AppShell title="Governance" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          MVP Module
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Governance
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Track governance records, mandates, policies, resolutions, authority, and related documents.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">No governance records yet</h2>
        <p className="mt-2 text-sm text-stone-400">
          Add a governance record such as a trust deed, policy, mandate, resolution, or committee record.
        </p>
      </section>
    </AppShell>
  );
}
