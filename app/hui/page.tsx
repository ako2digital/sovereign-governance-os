export default function HuiPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-8 py-8 text-stone-100">
      <a href="/" className="text-sm text-stone-400 hover:text-stone-100">
        ? Back to dashboard
      </a>

      <p className="mt-8 text-xs uppercase tracking-[0.25em] text-stone-500">
        MVP Module
      </p>

      <h1 className="mt-3 text-3xl font-semibold">Hui</h1>

      <p className="mt-4 max-w-2xl text-stone-400">
        Create hui records connected to attendees, agenda, minutes, decisions, documents, and tasks.
      </p>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold">No hui records yet</h2>
        <p className="mt-2 text-sm text-stone-400">
          Create the first hui to begin tracking korero, minutes, decisions, and actions.
        </p>
      </section>
    </main>
  );
}
