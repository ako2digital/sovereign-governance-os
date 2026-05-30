import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
};

export default function AppShell({
  children,
  title,
  eyebrow,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute left-0 top-0 h-px w-full bg-stone-100/10" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-stone-100/10" />
        <div className="absolute left-1/4 top-0 h-full w-px bg-stone-100/10" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-stone-100/10" />
        <div className="absolute left-3/4 top-0 h-full w-px bg-stone-100/10" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />

        <section className="min-w-0 flex-1">
          <Topbar title={title} eyebrow={eyebrow} />

          <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}