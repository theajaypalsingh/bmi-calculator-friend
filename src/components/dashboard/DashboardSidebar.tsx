
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { 
  FileText,
  User,
  LogOut,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardSidebar = () => {
  const sidebar = useSidebar();
  const { signOut, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const currentPath = location.pathname;
  
  const [isVisible, setIsVisible] = useState(!isMobile);

  useEffect(() => {
    setIsVisible(!isMobile);
  }, [isMobile]);

  const links = [
    {
      title: "My Reports",
      url: "/dashboard/reports",
      icon: FileText,
    },
    {
      title: "My Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ];

  const isActive = (path: string) => currentPath === path;
  const isExpanded = links.some((i) => isActive(i.url));
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar
      className={`${sidebar.state === "collapsed" ? "w-14" : "w-64"} transition-all duration-300 ease-in-out border-r bg-gray-50`}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        {user && (
          <div className={`px-3 py-2 mb-4 ${sidebar.state === "collapsed" ? "text-center" : ""}`}>
            <div className="text-sm font-medium text-gray-500">
              {sidebar.state !== "collapsed" && "Welcome,"}
            </div>
            <div className="font-semibold truncate">
              {sidebar.state === "collapsed" ? user.email?.charAt(0).toUpperCase() : user.email}
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={link.url} end className={getNavCls}>
                      <link.icon className="mr-2 h-4 w-4" />
                      {sidebar.state !== "collapsed" && <span>{link.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className="w-full text-left hover:bg-sidebar-accent/50">
                  <LogOut className="mr-2 h-4 w-4" />
                  {sidebar.state !== "collapsed" && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
