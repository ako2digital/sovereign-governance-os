export default function TasksPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-8 py-8 text-stone-100">
      <a href="/" className="text-sm text-stone-400 hover:text-stone-100">
        ? Back to dashboard
      </a>

      <p className="mt-8 text-xs uppercase tracking-[0.25em] text-stone-500">
        MVP Module
      </p>

      <h1 className="mt-3 text-3xl font-semibold">Tasks</h1>

      <p className="mt-4 max-w-2xl text-stone-400">
        Track follow-up actions, assigned people, due dates, status, and accountability.
      </p>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold">No tasks yet</h2>
        <p className="mt-2 text-sm text-stone-400">
          Add a task to track responsibility and follow-through.
        </p>
      </section>
    </main>
  );
}
