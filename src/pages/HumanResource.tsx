import { useState, useEffect } from "react";
import axios from "axios"; // ★ axios 추가
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";


const API_BASE_URL = "http://localhost:8000/api";

const HumanResource = () => {
  // --- 1. 상태(State) 관리 ---
  const [developers, setDevelopers] = useState([]);
  
  // ★ [수정 1] 주석을 해제해서 변수를 살려냅니다.
  const [selectedSkill, setSelectedSkill] = useState<string>("all"); 
  
  const [skillList, setSkillList] = useState([]);

  // --- 2. API 호출 함수 정의 ---

  // (1) 개발자 목록 가져오기
  const fetchDevelopers = async () => {
    try {
      // 'all'이 아니면 skill_name 파라미터를 보냅니다 (백엔드 요구사항)
      const params = selectedSkill !== "all" ? { skill_name: selectedSkill } : {};
      
      const response = await axios.get(`${API_BASE_URL}/developers/search`, {
        params: params,
      });

      // 안전장치: 받아온 데이터가 배열인지 확인
      if (Array.isArray(response.data)) {
        setDevelopers(response.data);
      } else {
        console.error("개발자 목록이 배열이 아닙니다!", response.data);
        setDevelopers([]);
      }
      console.log("개발자 목록 로드:", response.data);
    } catch (error) {
      console.error("개발자 목록 로드 실패:", error);
      setDevelopers([]);
    }
  };

  // (2) 기술 스택 목록 가져오기
  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/skill`);
      console.log("기술 목록 로드 성공:", response.data);

      // 안전장치: 받아온 데이터가 배열(혹은 객체 속 배열)인지 확인
      if (Array.isArray(response.data)) {
        setSkillList(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setSkillList(response.data.data); // { "data": [...] } 형태일 경우
      } else if (response.data && Array.isArray(response.data.skills)) {
        setSkillList(response.data.skills); // { "skills": [...] } 형태일 경우
      } else {
        console.error("기술 목록이 배열이 아닙니다!", response.data);
        setSkillList([]);
      }
    } catch (error) {
      console.error("기술 목록 로드 실패:", error);
      setSkillList([]);
    }
  };

  // (3) 인력 투입 (PATCH)
  const handleAssign = async (developerId: number, currentStatus: number, name: string) => {
    // 백엔드에서 온 데이터의 필드명을 확인해야 합니다 (예: projectStatus, status 등)
    const isWorking = currentStatus === 1; 

    if (isWorking) {
      toast.error("투입 불가", { description: "이미 참여 중인 인력입니다." });
      return;
    }

    try {
      await axios.patch(`${API_BASE_URL}/developers/assign`, {
        developerId: developerId,
        status: 1, // 투입 상태로 변경
      });

      await fetchDevelopers(); // 성공 시 목록 새로고침

      toast.success("투입 완료", {
        description: `${name}님이 프로젝트에 배정되었습니다.`,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error("투입 요청 실패:", error);
      toast.error("투입 실패", { description: "서버 오류가 발생했습니다." });
    }
  };

  // --- 3. useEffect (데이터 로딩 시점 관리) ---

  // ★ [수정 2] useEffect를 역할에 맞게 두 개로 분리합니다.

  // (1) 기술 목록은 화면이 켜질 때 "딱 한 번만"
  useEffect(() => {
    fetchSkills();
  }, []); // 의존성 배열 []: run once

  // (2) 개발자 목록은 "selectedSkill"이 바뀔 때마다 "매번 다시"
  useEffect(() => {
    fetchDevelopers();
  }, [selectedSkill]); // 의존성 배열 [selectedSkill]: selectedSkill이 바뀔 때마다 재실행

  // --- 4. 화면 렌더링 ---
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
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
              {/* 기술 선택 필터 */}
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
                    {skillList.map((skill: any, index) => (
                      <SelectItem
                        key={index}
                        // 백엔드에서 온 데이터의 키값을 사용 (skill_name, name 등)
                        value={skill.skill_name || skill.name || skill}
                      >
                        {skill.skill_name || skill.name || skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 테이블 */}
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
                      {developers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            데이터가 없거나 로딩 중입니다.
                          </td>
                        </tr>
                      ) : (
                        developers.map((dev: any) => {
                          // 백엔드에서 오는 상태값을 확인 (status, projectStatus 등)
                          const isWorking = dev.status === 1 || dev.projectStatus === 1;
                          
                          return (
                            <tr
                              key={dev.id || dev.developerId}
                              className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-foreground">
                                {dev.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">
                                {dev.rank || dev.position}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                                >
                                  {/* 백엔드에서 오는 기술 키값 확인 */}
                                  {dev.skill || dev.skill_name}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                {isWorking ? (
                                  <Badge
                                    variant="secondary"
                                    className="text-muted-foreground"
                                  >
                                    참여 중
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-600 hover:bg-green-700">
                                    투입 가능
                                  </Badge>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  size="sm"
                                  variant={isWorking ? "ghost" : "default"}
                                  className={isWorking ? "h-8 text-muted-foreground" : "h-8"}
                                  disabled={isWorking}
                                  onClick={() =>
                                    handleAssign(
                                      dev.id || dev.developerId,
                                      dev.status || dev.projectStatus,
                                      dev.name
                                    )
                                  }
                                >
                                  {isWorking ? (
                                    "투입 불가"
                                  ) : (
                                    <>
                                      <UserPlus className="mr-2 h-3 w-3" />
                                      투입
                                    </>
                                  )}
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