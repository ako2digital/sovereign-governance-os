import ThemeToggle from "@/components/theme/ThemeToggle";
import SearchBar from "./SearchBar";

type TopbarProps = {
  title?: string;
  eyebrow?: string;
};

export default function Topbar({
  title = "Tangata",
  eyebrow = "Governance OS",
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)] py-3 pl-16 pr-4 dark:bg-[var(--surface)] lg:pl-6 lg:pr-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 truncate text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg">
            {title}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
