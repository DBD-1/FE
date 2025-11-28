import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EvaluationListPage from "./pages/EvaluationListPage";
import EvaluationPage from "./pages/EvaluationPage";
import Employees from "./pages/Employees";
import HumanResource from "./pages/HumanResource";
import ClientRankingPage from "./pages/ClientRankingPage";
import NotFound from "./pages/NotFound";

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/evaluation" element={<EvaluationListPage />} />
          <Route path="/evaluation/:projectId" element={<EvaluationPage />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/human-resource" element={<HumanResource />} />
          <Route path="/client-ranking" element={<ClientRankingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;