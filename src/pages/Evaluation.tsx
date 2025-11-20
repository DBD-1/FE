import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 1. 실제 API 대신, 우리가 만든 가짜(Mock) 데이터 파일을 import 합니다.
import mockCompletedProjects from '../mocks/completedProjects.json';
// 고객 등급 조회를 위한 Mock 데이터를 import 합니다.
import mockClientGrade from '../mocks/clientGrade.json';

// shadcn/ui의 AlertDialog 컴포넌트를 import 합니다.
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

// API 응답 데이터의 타입을 정의합니다.
interface Project {
  project_id: number;
  project_name: string;
  end_date: string;
  client_id: number;
  client_name: string;
  eval_status: "완료" | "미완료";
}

// 고객 등급 API 응답 데이터 타입을 정의합니다.
interface ClientGrade {
  client_id: number;
  average_score: number;
  grade: string;
  priority: number;
}

const Evaluation = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isError = false; // 에러 상태는 시뮬레이션하지 않음

  // 모달 상태 관리를 위한 state
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedClientGrade, setSelectedClientGrade] = useState<ClientGrade | null>(null);
  const [modalClientName, setModalClientName] = useState('');


  useEffect(() => {
    // sessionStorage에서 프로젝트 목록을 가져옵니다.
    const storedProjects = sessionStorage.getItem('completedProjects');
    if (storedProjects) {
      // 저장된 데이터가 있으면 그것을 사용합니다.
      setProjects(JSON.parse(storedProjects));
    } else {
      // 없으면, 초기 mock 데이터를 사용하고 sessionStorage에 저장합니다.
      setProjects(mockCompletedProjects as Project[]);
      sessionStorage.setItem('completedProjects', JSON.stringify(mockCompletedProjects));
    }
    setIsLoading(false);
  }, []);

  // "등급조회" 버튼 클릭 핸들러
  const handleGradeCheck = (clientId: number, clientName: string) => {
    // API 호출 시뮬레이션: client_id를 사용해 데이터를 가져온다고 가정합니다.
    console.log(`고객 등급 조회 API 호출 시뮬레이션: /api/clients/${clientId}/grade`);
    
    // clientGrade.json에서 가져온 배열에서 clientId와 일치하는 데이터를 찾습니다.
    const clientData = (mockClientGrade as ClientGrade[]).find(
      (client) => client.client_id === clientId
    );
    
    console.log('서버로부터 받은 응답 데이터 (시뮬레이션):', clientData);
    setSelectedClientGrade(clientData || null);
    setModalClientName(clientName);
    setIsGradeModalOpen(true);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">프로젝트 목록을 불러오는 중...</div>;
  }

  if (isError) {
    return <div className="container mx-auto p-4">오류가 발생했습니다.</div>;
  }

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-bold text-foreground mb-6">종료된 프로젝트 목록</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>프로젝트명</TableHead>
            <TableHead>고객사</TableHead>
            <TableHead>종료일</TableHead>
            <TableHead>평가상태</TableHead>
            <TableHead>동작</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.project_id}>
              <TableCell>{project.project_name}</TableCell>
              <TableCell>{project.client_name}</TableCell>
              <TableCell>{project.end_date}</TableCell>
              <TableCell><Badge variant={project.eval_status === '완료' ? 'default' : 'secondary'}>{project.eval_status}</Badge></TableCell>
              <TableCell>
                {project.eval_status === '미완료' && (
                  <Button asChild>
                    <Link to={`/evaluation/${project.project_id}`}>평가하기</Link>
                  </Button>
                )}
                {project.eval_status === '완료' && (
                  <Button variant="outline" onClick={() => handleGradeCheck(project.client_id, project.client_name)}>
                    등급조회
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 고객 등급 조회 결과 모달 */}
      <AlertDialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{modalClientName} 고객 등급 정보</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedClientGrade && (
                <div className="mt-4 space-y-2 text-sm text-foreground">
                  <p><strong>평균 점수:</strong> {selectedClientGrade.average_score.toFixed(2)}점</p>
                  <p><strong>신용 등급:</strong> {selectedClientGrade.grade} 등급</p>
                  <p><strong>프로젝트 우선순위:</strong> {selectedClientGrade.priority} 순위</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Evaluation;
