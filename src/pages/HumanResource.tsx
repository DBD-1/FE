import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";

// 가짜 데이터 (status: 0 = 투입가능, 1 = 참여중)
const INITIAL_DATA = [
  { id: 1, name: "김한슬", rank: "선임", skill: "React", status: 0 },
  { id: 2, name: "이태연", rank: "책임", skill: "Java", status: 1 },
  { id: 3, name: "박지성", rank: "사원", skill: "React", status: 0 },
  { id: 4, name: "손흥민", rank: "수석", skill: "Python", status: 0 },
  { id: 5, name: "김연아", rank: "책임", skill: "Java", status: 0 },
  { id: 6, name: "아이유", rank: "선임", skill: "React", status: 1 },
];

const HumanResource = () => {
  // 상태 관리
  const [developers, setDevelopers] = useState(INITIAL_DATA);
  const [selectedSkill, setSelectedSkill] = useState<string>("all");

  // 필터링 로직
  const filteredDevelopers = developers.filter((dev) => {
    if (selectedSkill === "all") return true;
    return dev.skill === selectedSkill;
  });

  // 투입 로직
  const handleAssign = (developerId: number, currentStatus: number, name: string) => {
    if (currentStatus === 1) {
      toast.error("투입 불가", {
        description: "이미 다른 프로젝트에 참여 중입니다.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    setDevelopers((prevList) =>
      prevList.map((dev) =>
        dev.id === developerId ? { ...dev, status: 1 } : dev
      )
    );

    toast.success("투입 완료", {
      description: `${name}님이 프로젝트에 배정되었습니다.`,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 영역 (Employees.tsx 스타일) */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">인력 투입</h2>
          <p className="text-muted-foreground mt-1">
            프로젝트에 필요한 기술을 가진 인력을 검색하고 투입합니다
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>개발자 목록</CardTitle>
            <CardDescription>
              기술 스택으로 개발자를 조회하고 투입하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 필터 영역 (Employees.tsx의 검색창 위치와 스타일 유사하게 구성) */}
              <div className="flex items-center">
                 <Select
                  value={selectedSkill}
                  onValueChange={(value) => setSelectedSkill(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="기술 스택 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 보기</SelectItem>
                    <SelectItem value="Java">Java (Spring)</SelectItem>
                    <SelectItem value="React">React (Frontend)</SelectItem>
                    <SelectItem value="Python">Python (AI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 테이블 영역 (Employees.tsx 스타일 그대로 적용) */}
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">이름</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">직급</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">보유 기술</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">현재 상태</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-foreground">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDevelopers.map((dev) => (
                        <tr
                          key={dev.id}
                          className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {dev.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {dev.rank}
                          </td>
                          <td className="px-4 py-3">
                             <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                              {dev.skill}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {dev.status === 0 ? (
                              <Badge className="bg-green-600 hover:bg-green-700">
                                투입 가능
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-muted-foreground">
                                참여 중
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              size="sm"
                              variant={dev.status === 0 ? "default" : "ghost"}
                              className={dev.status === 0 ? "h-8" : "h-8 text-muted-foreground"}
                              disabled={dev.status === 1}
                              onClick={() => handleAssign(dev.id, dev.status, dev.name)}
                            >
                                {dev.status === 0 ? (
                                    <>
                                        <UserPlus className="mr-2 h-3 w-3" />
                                        투입
                                    </>
                                ) : (
                                    "투입 불가"
                                )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 검색 결과 없음 처리 */}
              {filteredDevelopers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  해당 기술을 보유한 개발자가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HumanResource;