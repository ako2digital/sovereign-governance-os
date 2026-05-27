export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-stone-950 px-8 py-8 text-stone-100">
      <a href="/" className="text-sm text-stone-400 hover:text-stone-100">
        ? Back to dashboard
      </a>

      <p className="mt-8 text-xs uppercase tracking-[0.25em] text-stone-500">
        MVP Module
      </p>

      <h1 className="mt-3 text-3xl font-semibold">Governance</h1>

      <p className="mt-4 max-w-2xl text-stone-400">
        Track governance records, mandates, policies, resolutions, authority, and related documents.
      </p>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold">No governance records yet</h2>
        <p className="mt-2 text-sm text-stone-400">
          Add a governance record such as a trust deed, policy, mandate, resolution, or committee record.
        </p>
      </section>
    </main>
  );
}
