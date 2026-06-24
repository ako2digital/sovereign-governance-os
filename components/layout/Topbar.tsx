import ThemeToggle from "@/components/theme/ThemeToggle";

type TopbarProps = {
  title?: string;
  eyebrow?: string;
};

export default function Topbar({
  title = "Sovereign Governance OS",
  eyebrow = "Governance Registry",
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-700 bg-stone-950/80 py-5 pl-20 pr-6 backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />

          <a
            href="/people/new"
            className="rounded-full bg-stone-100 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-white"
          >
            New Record
          </a>

          <div className="hidden rounded-full border border-green-900 bg-green-950/30 px-4 py-2 text-sm font-medium text-green-300 sm:block">
            Live Registry
          </div>
        </div>
      </div>
    </header>
  );
}