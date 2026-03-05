import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="flex-1 flex flex-col md:border-l border-border/40 overflow-hidden relative">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto w-full">
            {children}
        </main>
      </div>
    </div>
  );
}
