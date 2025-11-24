import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// 샘플 데이터
const employees = [
  { id: 1, name: "김철수", department: "개발팀", position: "시니어", deployed: true, project: "A프로젝트" },
  { id: 2, name: "이영희", department: "디자인팀", position: "주니어", deployed: true, project: "B프로젝트" },
  { id: 3, name: "박민수", department: "개발팀", position: "미들", deployed: false, project: "-" },
  { id: 4, name: "정수진", department: "기획팀", position: "시니어", deployed: true, project: "C프로젝트" },
  { id: 5, name: "최동욱", department: "개발팀", position: "주니어", deployed: false, project: "-" },
  { id: 6, name: "강민지", department: "디자인팀", position: "미들", deployed: true, project: "A프로젝트" },
  { id: 7, name: "윤서현", department: "개발팀", position: "시니어", deployed: true, project: "D프로젝트" },
  { id: 8, name: "임지훈", department: "기획팀", position: "미들", deployed: false, project: "-" },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">직원 검색</h2>
          <p className="text-muted-foreground mt-1">직원 정보 및 투입 현황을 확인하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>직원 목록</CardTitle>
            <CardDescription>직원 이름 또는 부서로 검색하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="직원 이름 또는 부서 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">이름</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">부서</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">직급</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">투입 상태</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">프로젝트</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{employee.name}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{employee.department}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{employee.position}</td>
                          <td className="px-4 py-3">
                            {employee.deployed ? (
                              <Badge className="bg-primary hover:bg-primary/90">투입중</Badge>
                            ) : (
                              <Badge variant="secondary">대기</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{employee.project}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
