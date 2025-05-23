
import { Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
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
  }, {
    href: "/dietary-tips",
    label: "Dietary Tips"
  }];

  const handleLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return <footer className="text-white bg-gray-700 w-full flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-max">
              <h3 className="text-lg font-bold mb-4 text-white">Sitemap</h3>
              <ul className="space-y-2 text-left w-max">
                {links.map(link => <li key={link.href}>
                    <Link to={link.href} className="text-sm text-white hover:text-gray-300 transition-colors" onClick={handleLinkClick}>
                      {link.label}
                    </Link>
                  </li>)}
              </ul>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4 text-white">Connect</h3>
            <a href="https://www.linkedin.com/in/ajay-pal-singh-rajput-5956b5181/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-white hover:text-gray-300 transition-colors" aria-label="LinkedIn Profile">
              <Linkedin size={20} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="bg-gray-950 w-full">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-white">&copy; {new Date().getFullYear()} BMI Calculator. All rights reserved.</p>
          <p className="text-sm mt-2 text-white">
            This calculator provides general information and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>;
};

export default Footer;
