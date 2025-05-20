
import { ReactNode } from "react";
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
