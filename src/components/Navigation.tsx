
import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Calculator, ActivitySquare, Heart, Phone } from "lucide-react";

const Navigation = () => {
  return (
    <div className="bg-health-primary text-white py-3 shadow-md">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-none w-full justify-between">
          <NavigationMenuList className="flex flex-wrap justify-center md:justify-start gap-1">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white bg-transparent hover:bg-health-dark"}>
                  <Calculator className="mr-1" size={18} />
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
    </div>
  );
};

export default Navigation;
