import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  Dot,
  StatusBadge,
  buttonPrimaryClass,
} from "@/components/ui-system/primitives";

type TopbarProps = {
  title?: string;
  eyebrow?: string;
};

export default function Topbar({
  title = "Sovereign Governance OS",
  eyebrow = "Governance Registry",
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)] py-5 pl-20 pr-6 dark:bg-white/5 dark:backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />

          <a href="/people/new" className={buttonPrimaryClass}>
            New Record
          </a>

          <div className="hidden sm:block">
            <StatusBadge>
              <Dot />
              Live Registry
            </StatusBadge>
          </div>
        </div>
      </div>
    </header>
  );
}