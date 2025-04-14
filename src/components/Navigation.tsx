
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Calculator, ActivitySquare, Heart, Phone } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return <div className="sticky top-0 z-50 text-white py-3 shadow-md bg-gray-950">
      <div className="container mx-auto px-[93px]">
        <NavigationMenu className="max-w-none w-full justify-between mx-0 bg-transparent my-[5px] px-[240px]">
          <NavigationMenuList className="flex flex-wrap justify-center md:justify-start gap-1">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-gray-800 hover:text-white ${currentPath === "/" ? "bg-gray-800 text-white" : "text-white"}`}>
                  <Calculator size={18} className="mr-1 bg-transparent" />
                  BMI Calculator
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/step-count">
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-gray-800 hover:text-white ${currentPath === "/step-count" ? "bg-gray-800 text-white" : "text-white"}`}>
                  <ActivitySquare className="mr-1" size={18} />
                  Daily Step Count
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/health-score">
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-gray-800 hover:text-white ${currentPath === "/health-score" ? "bg-gray-800 text-white" : "text-white"}`}>
                  <Heart className="mr-1" size={18} />
                  Health Score
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/consultation">
                <NavigationMenuLink 
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-gray-800 hover:text-white ${currentPath === "/consultation" ? "bg-gray-800 text-white" : "text-white"}`}>
                  <Phone className="mr-1" size={18} />
                  Free Consultation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>;
};
export default Navigation;
