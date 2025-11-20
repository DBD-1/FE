import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
// import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import Employees from "./pages/Employees";
import EvaluationListPage from "./pages/EvaluationListPage";
import EvaluationPage from "./pages/EvaluationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          {/*<Route path="/login" element={<Login />} />*/}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* [수정] 평가 목록 페이지 경로 */}
          <Route path="/evaluation" element={<EvaluationListPage />} />
          {/* 평가 입력 페이지 */}
          <Route path="/evaluation/:projectId" element={<EvaluationPage />} />
          <Route path="/employees" element={<Employees />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
