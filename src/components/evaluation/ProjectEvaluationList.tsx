import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EmployeeProject } from "@/types/evaluation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EvaluationFormModal from "./EvaluationFormModal";

// API 함수 (실제 API 주소로 변경해야 합니다)
const fetchMyProjects = async (): Promise<EmployeeProject[]> => {
  // 이 API는 현재 로그인한 직원이 참여한 '종료된' 프로젝트 목록을 반환해야 합니다.
  // 지금은 더미 데이터를 사용합니다.
  // const response = await fetch('/api/my-projects/completed');
  // if (!response.ok) {
  //   throw new Error('프로젝트 목록을 불러오는데 실패했습니다.');
  // }
  // return response.json();

  // --- 더미 데이터 로직 수정 ---
  // 세션 스토리지를 사용하여 평가 상태 변경을 시뮬레이션합니다.
  const storedData = sessionStorage.getItem("dummyProjects");
  if (!storedData) {
    // 세션 스토리지에 데이터가 없을 때만 초기 데이터를 설정합니다.
    const initialData: EmployeeProject[] = [
      { id: 1, name: "알파 프로젝트", endDate: "2025-10-20", evaluationStatus: "COMPLETED" },
      { id: 2, name: "베타 프로젝트", endDate: "2025-10-25", evaluationStatus: "PENDING" },
      { id: 3, name: "감마 프로젝트", endDate: "2025-11-01", evaluationStatus: "PENDING" },
    ];
    sessionStorage.setItem("dummyProjects", JSON.stringify(initialData));
  }

  await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 지연
  return JSON.parse(sessionStorage.getItem("dummyProjects") || "[]");
  // --- 더미 데이터 로직 수정 끝 ---
};

const ProjectEvaluationList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<EmployeeProject | null>(null);
  const queryClient = useQueryClient();
  const queryKey = ["myCompletedProjects"];

  const { data: projects, isLoading, error, refetch } = useQuery<EmployeeProject[]>({
    queryFn: fetchMyProjects,
    queryKey,
  });

  const handleEvaluateClick = (project: EmployeeProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleEvaluationSuccess = () => {
    handleModalClose();

    if (!selectedProject) return;

    // 낙관적 업데이트 (Optimistic Update)
    // 서버 응답을 기다리지 않고 UI를 즉시 '평가완료' 상태로 변경합니다.
    queryClient.setQueryData<EmployeeProject[]>(queryKey, (oldData = []) => {
      if (!oldData) return [];
      const newData = oldData.map((project) =>
        project.id === selectedProject.id
          ? { ...project, evaluationStatus: "COMPLETED" }
          : project
      );

      // 더미 데이터 상태도 함께 업데이트하여 refetch 시에도 상태가 유지되도록 합니다.
      // 실제 API 연동 시에는 이 부분이 필요 없습니다.
      sessionStorage.setItem("dummyProjects", JSON.stringify(newData));

      return newData;
    });

    // 실제 데이터 동기화를 위해 백그라운드에서 refetch를 실행합니다.
    // 만약 refetch가 실패하면, queryClient가 자동으로 이전 상태로 롤백해줍니다.
    // (useQuery 설정에 따라 동작이 다를 수 있습니다.)
    // 이 방식은 사용자에게 더 빠른 피드백을 제공합니다.
    // refetch(); // 기존 방식: 서버로부터 데이터를 다시 불러와 UI를 업데이트합니다.
    // 낙관적 업데이트를 사용하므로, 즉각적인 refetch 호출은 필수는 아니지만 데이터 정합성을 위해 유지할 수 있습니다.
  };

  if (isLoading) return <div>프로젝트 목록을 불러오는 중...</div>;
  if (error) return <div>오류가 발생했습니다: {error.message}</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>참여 프로젝트 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {projects?.map((project) => (
              <li key={project.id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <span className="font-semibold">{project.name}</span>
                  <span className="text-sm text-gray-500 ml-2">(종료일: {project.endDate})</span>
                </div>
                {project.evaluationStatus === 'COMPLETED' ? (
                  <Badge variant="secondary">평가 완료</Badge>
                ) : (
                  <Button onClick={() => handleEvaluateClick(project)}>평가하기</Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {selectedProject && <EvaluationFormModal isOpen={isModalOpen} onClose={handleModalClose} project={selectedProject} onSubmitSuccess={handleEvaluationSuccess} />}
    </>
  );
};

export default ProjectEvaluationList;