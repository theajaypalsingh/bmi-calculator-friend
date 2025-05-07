
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DietaryTips from "./pages/DietaryTips";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import StepCount from "./pages/StepCount";
import HealthScore from "./pages/HealthScore";
import Consultation from "./pages/Consultation";
import BodyFat from "./pages/BodyFat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dietary-tips" element={<DietaryTips />} />
          <Route path="/step-count" element={<StepCount />} />
          <Route path="/health-score" element={<HealthScore />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/body-fat" element={<BodyFat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
