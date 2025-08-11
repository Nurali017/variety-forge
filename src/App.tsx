import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VarietiesList from "./pages/VarietiesList";

import VarietyCardPage from "./pages/VarietyCardPage";
import TestResultsForm from "./pages/TestResultsForm";
import CreateVariety from "./pages/CreateVariety";
import TrialsList from "./pages/TrialsList";
import CreateTrial from "./pages/CreateTrial";
import TrialEntry from "./pages/TrialEntry";
import NotFound from "./pages/NotFound";
import ReportsPreview from "./pages/ReportsPreview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VarietiesList />} />
          <Route path="/variety/:id" element={<VarietyCardPage />} />
          <Route path="/varieties/:varietyId" element={<VarietyCardPage />} />
          <Route path="/variety/:id/test-results" element={<TestResultsForm />} />
          <Route path="/varieties/new" element={<CreateVariety />} />
          <Route path="/index" element={<Index />} />
          {/* Trials routes */}
          <Route path="/trials" element={<TrialsList />} />
          <Route path="/trials/new" element={<CreateTrial />} />
          <Route path="/trials/:id/entry" element={<TrialEntry />} />
          {/* Reports */}
          <Route path="/reports/preview" element={<ReportsPreview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
