import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ClipboardCheck, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="text-center space-y-8 px-4">
        <div className="flex items-center justify-center mb-6">
          <Building2 className="h-16 w-16 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">사내 업무 시스템</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            직원 관리, 평가, 투입 현황을 한눈에 확인하고 관리하세요
          </p>
        </div>

        <div className="flex flex-wrap gap-8 justify-center mt-12 mb-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-primary/10 p-4 rounded-full">
              <ClipboardCheck className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">평가 관리</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-primary/10 p-4 rounded-full">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">직원 검색</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-primary/10 p-4 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">투입 현황</p>
          </div>
        </div>

        <Button 
          size="lg" 
          onClick={() => navigate("/dashboard")}
          className="group"
        >
          시작하기
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
