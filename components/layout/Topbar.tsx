type TopbarProps = {
    title?: string;
    eyebrow?: string;
  };
  
  export default function Topbar({
    title = "Sovereign Governance OS",
    eyebrow = "30-Day MVP Sprint",
  }: TopbarProps) {
    return (
      <header className="border-b border-stone-800 bg-stone-950/80 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
          </div>
  
          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            Week 1 — Foundation
          </div>
        </div>
      </header>
    );
  }
  