
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  const links = [{
    href: "/",
    label: "Home"
  }, {
    href: "/health-score",
    label: "Health Score"
  }, {
    href: "/step-count",
    label: "Step Count"
  }, {
    href: "/body-fat",
    label: "Body Fat Calculator"
  }, {
    href: "/bmr-calculator",
    label: "BMR Calculator"
  }, {
    href: "/consultation",
    label: "Consultation"
  }];

  // Show mobile navigation
  if (isMobile) {
    return (
      <div className="bg-gray-800 text-white w-full fixed top-0 z-50">
        <div className="px-4">
          <div className="flex justify-between items-center py-3">
            <div>
              {user && (
                <Link to="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                    <User size={16} className="mr-1" />
                    {user.email?.split('@')[0] || 'Account'}
                  </Button>
                </Link>
              )}
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none" aria-label="Toggle navigation menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="px-4 pb-3">
            <nav className="flex flex-col space-y-2">
              {links.map(link => (
                <Link key={link.href} to={link.href} className={cn("px-3 py-2 rounded-md text-base font-medium", location.pathname === link.href ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white")} onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link to="/dashboard/reports" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                    My Reports
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    );
  }

  // Show desktop navigation
  return (
    <div className="bg-gray-800 text-white w-full fixed top-0 z-50">
      <div className="bg-gray-950 w-full">
        <div className="flex items-center justify-between h-16 px-8">
          <nav className="flex-1 flex justify-center">
            <div className="flex space-x-4">
              {links.map(link => (
                <Link key={link.href} to={link.href} className={cn("px-3 py-2 rounded-md text-sm font-medium", location.pathname === link.href ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white")}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
          
          <div>
            {user && (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard/reports">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                    My Reports
                  </Button>
                </Link>
                <Link to="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                    <User size={16} className="mr-1" />
                    {user.email?.split('@')[0] || 'Account'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
