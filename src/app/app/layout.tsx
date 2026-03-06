import { AppSidebar } from "@/components/layout/AppSidebar";
import { GlobalSearch } from "@/components/GlobalSearch";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <GlobalSearch />
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto w-full pb-24 md:pb-0 md:pl-28">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

