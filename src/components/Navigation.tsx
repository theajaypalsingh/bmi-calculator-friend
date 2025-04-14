
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Calculator, ActivitySquare, Heart, Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navigationItems = [
    {
      path: "/",
      label: "BMI Calculator",
      icon: Calculator,
    },
    {
      path: "/step-count",
      label: "Daily Step Count",
      icon: ActivitySquare,
    },
    {
      path: "/health-score",
      label: "Health Score",
      icon: Heart,
    },
    {
      path: "/consultation",
      label: "Free Consultation",
      icon: Phone,
    },
  ];

  // Function to render navigation items
  const renderNavigationItems = () => {
    return navigationItems.map((item) => {
      const isActive = currentPath === item.path;
      const Icon = item.icon;
      
      return (
        <NavigationMenuItem key={item.path}>
          <Link to={item.path} onClick={() => setOpen(false)}>
            <NavigationMenuLink 
              className={`${navigationMenuTriggerStyle()} transition-colors ${
                isActive 
                  ? "bg-white text-black hover:bg-gray-100 hover:text-black" 
                  : "bg-transparent text-white hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} className={`mr-1 ${isActive ? "" : "bg-transparent"}`} />
              {item.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      );
    });
  };

  // Mobile navigation with hamburger menu
  if (isMobile) {
    return (
      <div className="sticky top-0 z-50 text-white py-3 shadow-md bg-gray-950">
        <div className="container mx-auto px-4 flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu size={24} />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gray-950 text-white w-64 p-0">
              <div className="pt-6">
                <NavigationMenu className="max-w-none w-full mx-0 bg-transparent">
                  <NavigationMenuList className="flex flex-col space-y-2 px-2">
                    {renderNavigationItems()}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </SheetContent>
          </Sheet>
          <div className="mx-auto">
            <h1 className="text-lg font-medium">Health App</h1>
          </div>
        </div>
      </div>
    );
  }

  // Desktop navigation
  return (
    <div className="sticky top-0 z-50 text-white py-3 shadow-md bg-gray-950">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-none w-full justify-between mx-0 bg-transparent my-[5px]">
          <NavigationMenuList className="flex flex-wrap justify-center md:justify-start gap-1">
            {renderNavigationItems()}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navigation;
