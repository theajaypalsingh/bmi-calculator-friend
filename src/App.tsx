
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import DietaryTips from "./pages/DietaryTips";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import StepCount from "./pages/StepCount";
import HealthScore from "./pages/HealthScore";
import Consultation from "./pages/Consultation";
import BodyFat from "./pages/BodyFat";
import BMRCalculator from "./pages/BMRCalculator";
import BloodReports from "./pages/BloodReports";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfilePage from "./pages/dashboard/Profile";
import ReportsPage from "./pages/dashboard/Reports";

const queryClient = new QueryClient();

// ScrollToTop component to handle scroll on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, [pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen overflow-hidden">
            <ScrollToTop />
            <Navigation />
            <div className="flex-grow flex flex-col pt-16"> {/* Added padding-top equal to navbar height */}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dietary-tips" element={<DietaryTips />} />
                <Route path="/step-count" element={<StepCount />} />
                <Route path="/health-score" element={<HealthScore />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/body-fat" element={<BodyFat />} />
                <Route path="/bmr-calculator" element={<BMRCalculator />} />
                <Route path="/blood-reports" element={<BloodReports />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<Dashboard><ReportsPage /></Dashboard>} />
                <Route path="/dashboard/reports" element={<Dashboard><ReportsPage /></Dashboard>} />
                <Route path="/dashboard/profile" element={<Dashboard><ProfilePage /></Dashboard>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
