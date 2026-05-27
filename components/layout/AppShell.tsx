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
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Topbar title={title} eyebrow={eyebrow} />

          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
