type TopbarProps = {
  title?: string;
  eyebrow?: string;
};

export default function Topbar({
  title = "Sovereign Governance OS",
  eyebrow = "30-Day MVP Sprint",
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/80 px-6 py-5 backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/design-test"
            className="hidden rounded-full border border-stone-800 px-4 py-2 text-sm font-medium text-stone-400 transition hover:border-stone-600 hover:text-white md:inline-flex"
          >
            Design preview
          </a>

          <a
            href="/people/new"
            className="rounded-full border border-stone-800 px-4 py-2 text-sm font-medium text-stone-400 transition hover:border-stone-600 hover:text-white"
          >
            Add person
          </a>

          <div className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950">
            MVP Active
          </div>
        </div>
      </div>
    </header>
  );
}