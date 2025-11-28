import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
//import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Evaluation from "./pages/Evaluation";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";
import HumanResource from "./pages/HumanResource";
<<<<<<< HEAD
import EvaluationListPage from "./pages/EvaluationListPage";
import EvaluationPage from "./pages/EvaluationPage";
=======

//유민 언니
import EvaluationListPage from "./pages/EvaluationListPage";
import EvaluationPage from "./pages/EvaluationPage";

>>>>>>> ada344c0a5d34d93d39b620b80226134ba3dd36a
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< HEAD
          <Route path="/evaluation" element={<EvaluationListPage />} /> 
          <Route path="/evaluation/:projectId" element={<EvaluationPage />} />
=======
          {/* <Route path="/evaluation" element={<Evaluation />} /> */}
>>>>>>> ada344c0a5d34d93d39b620b80226134ba3dd36a
          <Route path="/employees" element={<Employees />} />
          <Route path="/human-resource" element={<HumanResource />} />
            {/* 평가 목록 페이지 */}
          <Route path="/evaluation" element={<EvaluationListPage />} /> 
          {/* 평가 입력 페이지 */}
          <Route path="/evaluation/:projectId" element={<EvaluationPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;