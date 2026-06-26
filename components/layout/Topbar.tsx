import ThemeToggle from "@/components/theme/ThemeToggle";
import { Dot, StatusBadge } from "@/components/ui-system/primitives";
import SearchBar from "./SearchBar";

type TopbarProps = {
  title?: string;
  eyebrow?: string;
};

export default function Topbar({
  title = "Sovereign Governance OS",
  eyebrow = "Governance Registry",
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)] py-4 pl-20 pr-6 dark:bg-white/5 dark:backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
            {title}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <SearchBar />
          <ThemeToggle />
          <div className="hidden sm:block">
            <StatusBadge>
              <Dot />
              Live
            </StatusBadge>
          </div>
        </div>
      </div>
    </header>
  );
}
