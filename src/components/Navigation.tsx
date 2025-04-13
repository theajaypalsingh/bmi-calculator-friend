import React from "react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Calculator, ActivitySquare, Heart, Phone } from "lucide-react";
const Navigation = () => {
  return <div className="text-white py-3 shadow-md bg-gray-950">
      <div className="container mx-auto px-[93px]">
        <NavigationMenu className="max-w-none w-full justify-between mx-0 bg-transparent my-[5px] px-[240px]">
          <NavigationMenuList className="flex flex-wrap justify-center md:justify-start gap-1">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-health-dark"}>
                  <Calculator size={18} className="mr-1 bg-transparent" />
                  BMI Calculator
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/step-count">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-health-dark"}>
                  <ActivitySquare className="mr-1" size={18} />
                  Daily Step Count
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/health-score">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-health-dark"}>
                  <Heart className="mr-1" size={18} />
                  Health Score
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/consultation">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-health-dark"}>
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