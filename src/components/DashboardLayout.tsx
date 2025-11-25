import { ReactNode } from "react";
import { NavLink } from "./NavLink";
import { Building2, ClipboardCheck, Users, UserPlus } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">사내 업무 시스템</h1>
            </div>
            <nav className="flex space-x-1">
              <NavLink
                to="/dashboard"
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                activeClassName="text-foreground bg-muted"
              >
                대시보드
              </NavLink>
              <NavLink
                to="/evaluation"
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                activeClassName="text-foreground bg-muted"
              >
                <ClipboardCheck className="h-4 w-4" />
                평가
              </NavLink>
              <NavLink
                to="/employees"
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                activeClassName="text-foreground bg-muted"
              >
                <Users className="h-4 w-4" />
                직원 검색
              </NavLink>

              {/* ★ 새로 추가된 [인력 투입] 버튼 ★ */}
              <NavLink
                to="/human-resource"
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                activeClassName="text-foreground bg-muted"
              >
                <UserPlus className="h-4 w-4" />
                인력 투입
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
