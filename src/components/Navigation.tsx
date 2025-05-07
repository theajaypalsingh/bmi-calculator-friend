import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
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
    href: "/consultation",
    label: "Consultation"
  }];

  // Show mobile navigation
  if (isMobile) {
    return <div className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div></div> {/* Empty div to maintain spacing */}
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none" aria-label="Toggle navigation menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {isOpen && <div className="container mx-auto px-4 pb-3">
            <nav className="flex flex-col space-y-2">
              {links.map(link => <Link key={link.href} to={link.href} className={cn("px-3 py-2 rounded-md text-base font-medium", location.pathname === link.href ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white")} onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>)}
            </nav>
          </div>}
      </div>;
  }

  // Show desktop navigation
  return <div className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 bg-gray-950">
        <div className="flex items-center justify-center h-16 bg-gray-950">
          <nav className="flex space-x-4">
            {links.map(link => <Link key={link.href} to={link.href} className={cn("px-3 py-2 rounded-md text-sm font-medium", location.pathname === link.href ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white")}>
                {link.label}
              </Link>)}
          </nav>
        </div>
      </div>
    </div>;
};
export default Navigation;