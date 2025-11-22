// src/pages/humanresource.tsx

import { useState, useMemo } from "react";
import { useFetchSkills, Skill } from "../api/api_skill"; 
import { useFetchDevelopers, Developer } from "../api/api_developer"; 
import { assignDeveloper } from '../api/api_assign';
import { useFetchAllEmployees, Employee } from '../api/api_employee';

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"; 


const HumanResource = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  //투입 여부 필터
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | '0' | '1'>('all');
  const { skillList, loading: skillsLoading, error: skillsError } = useFetchSkills();
  const { 
    developers: searchedDevelopers,
    loading: searchedLoading, 
    error: searchedError,
    fetchDevelopers: refetchDevelopers // 인력 투입 후 목록 갱신
  } = useFetchDevelopers(selectedSkills); 


  const { 
    employees: allEmployees,
    loading: allLoading, 
    error: allError 
  } = useFetchAllEmployees();


  // 기술 스택 다중 선택
  const handleSkillToggle = (skillName: string) => {
    setSelectedSkills(prevSkills => {
      if (prevSkills.includes(skillName)) {
        // 이미 선택된 경우: 제거 (선택 해제)
        return prevSkills.filter(skill => skill !== skillName);
      } else {
        // 선택되지 않은 경우: 추가 (선택)
        return [...prevSkills, skillName];
      }
    });
  };


  // 전체 보기
  const handleSelectAllSkills = () => {
    setSelectedSkills([]);
  }


  // 투입 여부 필터링
  const finalData = useMemo(() => {
    const sourceData = selectedSkills.length === 0 ? allEmployees : searchedDevelopers;

    const filtered = sourceData.filter(dev => {
      if (assignmentFilter === 'all') {
        return true;
      }
      const filterValue = parseInt(assignmentFilter, 10);

      return dev.project_assignment_yn === filterValue;
    });
        
    return filtered;

  }, [selectedSkills, allEmployees, searchedDevelopers, assignmentFilter]);
  

  // 인력 투입 (PATCH)
  const handleAssign = async (employeeId: number, currentStatus: number, name: string | null) => {
    const isWorking = currentStatus === 1; 

    if (isWorking) {
      toast.error("투입 불가", { description: "이미 참여 중인 인력입니다." });
      return;
    }

    try {
      await assignDeveloper(employeeId);
      refetchDevelopers(); 

      toast.success("투입 완료", { description: `${name}님이 프로젝트에 배정되었습니다.` });

    } catch (error) {
      console.error("투입 요청 실패:", error);
      toast.error("투입 실패", { description: "서버 오류가 발생했습니다." });
    }
  };


  // 화면 렌더링
  const isTotalLoading = skillsLoading || (selectedSkills.length === 0 ? allLoading : searchedLoading);


  // 에러 상태 통합
  const hasError = skillsError || (selectedSkills.length === 0 ? allError : searchedError);

  if (isTotalLoading) {
    return <DashboardLayout><div className="text-center py-10">데이터를 불러오는 중입니다...</div></DashboardLayout>;
  }
  if (hasError) {
    return <DashboardLayout><div className="text-center py-10 text-red-500">데이터 로드 에러: {hasError}</div></DashboardLayout>;
  }


  // 기술 선택 드롭다운에 표시할 값
  const skillSelectDisplay = selectedSkills.length === 0 
    ? "전체 보기" 
    : selectedSkills.length === 1 
      ? selectedSkills[0] 
      : `${selectedSkills[0]} 외 ${selectedSkills.length - 1}개`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>개발자 목록</CardTitle>
            <CardDescription>
              기술 스택과 투입 여부로 개발자를 조회하고 투입하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">

              {/* 기술 선택 필터 */}
              <div className="flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[180px] justify-between">
                      {skillSelectDisplay}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[180px]">
                    <DropdownMenuItem 
                      onSelect={handleSelectAllSkills}
                      className="flex justify-between items-center"
                    >
                    <span>전체 보기</span>
                    {selectedSkills.length === 0 && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* 기술 선택 드롭다운 */}
                    {skillList.map((skill: Skill) => {
                      const isSelected = selectedSkills.includes(skill.skill_name);
                      return (
                        <DropdownMenuItem
                          key={skill.skill_id}
                          onSelect={() => handleSkillToggle(skill.skill_name)}
                          className="flex justify-between items-center"
                        >
                        <span>{skill.skill_name}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 투입 여부 필터 */}
                <Select
                  value={assignmentFilter}
                  onValueChange={(value) => setAssignmentFilter(value as 'all' | '0' | '1')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="투입 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">투입 여부: 전체</SelectItem>
                    <SelectItem value="0">투입 가능</SelectItem>
                    <SelectItem value="1">투입 중</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 테이블 (개발자 목록) */}
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">직원 ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">이름</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">기술등급</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">투입 여부</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">보유 기술</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-foreground">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalData.length === 0 && selectedSkills.length === 0 ? (
                      <tr>
                        < td colSpan={6} className="text-center py-8 text-muted-foreground bg-yellow-50/50">
                          기술 스택을 선택하시면 해당 개발자 목록을 조회할 수 있습니다.
                        </td>
                      </tr>
                      ) : finalData.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-muted-foreground">
                            선택하신 기술을 보유한 개발자가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        finalData.map((dev) => {
                          const isWorking = dev.project_assignment_yn === 1;
                          const skillsToDisplay = (dev as Developer).matched_skills || (dev as Employee).skills;

                          return (
                            <tr key={dev.employee_id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                              <td className="px-4 py-3 text-sm text-muted-foreground">{dev.employee_id}</td>
                              <td className="px-4 py-3 text-sm font-medium text-foreground">
                                {(dev as Employee).employee_name || (dev as Developer).name}
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{dev.skill_level}</td>
                              <td className="px-4 py-3">
                                <Badge variant={isWorking ? "secondary" : "default"} className={isWorking ? "text-muted-foreground" : "bg-green-600 hover:bg-green-700"}>
                                  {isWorking ? "참여 중" : "투입 가능"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 space-x-1 flex flex-wrap gap-1">

                                {skillsToDisplay && skillsToDisplay.map(skill => (
                                  <Badge 
                                    key={skill} 
                                    variant="outline" 
                                    className="text-xs bg-blue-50/50 border-blue-200 text-blue-700"
                                  >
                                    {skill}
                                  </Badge>
                                ))}

                                {(!skillsToDisplay || skillsToDisplay.length === 0) && (
                                  <span className="text-xs text-muted-foreground">보유 기술 없음</span>
                                )}
                              </td>

                              {/* 작업 버튼 */}
                              <td className="px-4 py-3 text-right">
                                <Button
                                  size="sm"
                                  variant={isWorking ? "ghost" : "default"}
                                  disabled={isWorking}
                                  onClick={() => handleAssign(
                                  dev.employee_id, 
                                  dev.project_assignment_yn, 
                                  (dev as Employee).employee_name || (dev as Developer).name
                                  )}
                                >
                                  {isWorking ? "투입 불가" : <><UserPlus className="mr-2 h-3 w-3" />투입</>}
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HumanResource;