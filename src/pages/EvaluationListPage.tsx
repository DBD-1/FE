import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import mockCompletedProjects from '@/mocks/completedProjects.json'; // mocks 폴더의 데이터 사용
import mockClientGrade from '@/mocks/clientGrade.json'; // 등급 조회를 위한 mock 데이터
import type { ProjectForEvaluation, ClientGrade } from '@/types/evaluation';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * 종료된 프로젝트 목록을 표시하고, 각 프로젝트에 대한 평가 또는 등급 조회를 수행하는 페이지 컴포넌트입니다.
 */
function EvaluationListPage() {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  // 프로젝트 목록을 저장하는 상태
  const [projects, setProjects] = useState<ProjectForEvaluation[]>([]);
  // 고객 등급 조회 모달의 열림/닫힘 상태
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  // 모달에 표시할 선택된 고객의 등급 정보
  const [selectedClientGrade, setSelectedClientGrade] = useState<ClientGrade | null>(null);
  // 모달 제목에 표시할 고객사 이름
  const [modalClientName, setModalClientName] = useState('');

  useEffect(() => {
    // 컴포넌트 마운트 시, sessionStorage에서 프로젝트 목록을 불러옵니다.
    // 이는 평가 완료 후 목록으로 돌아왔을 때 상태를 유지하기 위함입니다.
    const storedProjects = sessionStorage.getItem('completedProjects');
    if (storedProjects) {
      // 1. 저장된 데이터가 있으면 파싱하여 상태를 업데이트합니다.
      setProjects(JSON.parse(storedProjects));
    } else {
      // 2. 저장된 데이터가 없으면(최초 방문 시), mock 데이터로 초기화하고 sessionStorage에 저장합니다.
      const initialProjects = mockCompletedProjects as ProjectForEvaluation[];
      setProjects(initialProjects);
      sessionStorage.setItem('completedProjects', JSON.stringify(initialProjects));
    }
  }, []);

  /**
   * '평가하기' 버튼 클릭 시, 해당 프로젝트의 평가 페이지로 이동하는 핸들러입니다.
   * @param project 선택된 프로젝트 객체
   */
  const handleEvaluateClick = (project: ProjectForEvaluation) => {
    navigate(`/evaluation/${project.project_id}`, { 
      state: { 
        projectName: project.project_name,
        clientName: project.client_name,
        clientId: project.client_id
      } 
    });
  };

  /**
   * '등급조회' 버튼 클릭 시, 고객의 등급 정보를 조회하고 모달을 여는 핸들러입니다.
   * @param clientId 조회할 고객 ID
   * @param clientName 조회할 고객사 이름
   */
  const handleGradeCheck = (clientId: number, clientName: string) => {
    // Mock 데이터에서 clientId와 일치하는 데이터를 찾아 API 응답을 시뮬레이션합니다.
    const clientData = (mockClientGrade as ClientGrade[]).find(
      (client) => client.client_id === clientId
    );
    
    // 콘솔에 API 응답 시뮬레이션 결과를 출력합니다.
    console.log('서버로부터 받은 응답 데이터 (시뮬레이션):', clientData);
    setSelectedClientGrade(clientData || null);
    setModalClientName(clientName);
    setIsGradeModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      {/* 페이지 상단 카드 UI */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>종료된 프로젝트 목록</CardTitle>
          <CardDescription>참여했던 프로젝트 중 종료된 프로젝트 목록입니다. 고객 평가를 진행해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            {/* 테이블 헤더 */}
            <TableHeader>
              <TableRow>
                <TableHead>프로젝트명</TableHead>
                <TableHead>고객사</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead className="text-center">평가 상태</TableHead>
                <TableHead className="text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* 프로젝트 목록을 순회하며 테이블 행을 렌더링합니다. */}
              {projects.map((project) => (
                <TableRow key={project.project_id}>
                  <TableCell className="font-medium">{project.project_name}</TableCell>
                  <TableCell>{project.client_name}</TableCell>
                  <TableCell>{project.end_date}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={project.eval_status === '완료' ? 'default' : 'secondary'}>
                      {project.eval_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {/* 평가 상태에 따라 '평가하기' 또는 '등급조회' 버튼을 조건부로 렌더링합니다. */}
                    {project.eval_status === '미완료' ? (
                      <Button onClick={() => handleEvaluateClick(project)}>
                        평가하기
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => handleGradeCheck(project.client_id, project.client_name)}>
                        등급조회
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 고객 등급 조회 결과를 표시하는 모달 컴포넌트 */}
      <AlertDialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{modalClientName} 고객 등급 정보</AlertDialogTitle>
            {/* 조회된 등급 정보가 있으면 표시하고, 없으면 안내 메시지를 표시합니다. */}
            <AlertDialogDescription>
              {selectedClientGrade ? (
                <div className="mt-4 space-y-2 text-sm text-foreground">
                  <p><strong>평균 점수:</strong> {selectedClientGrade.average_score.toFixed(2)}점</p>
                  <p><strong>신용 등급:</strong> {selectedClientGrade.grade} 등급</p>
                  <p><strong>프로젝트 우선순위:</strong> {selectedClientGrade.priority} 순위</p>
                </div>
              ) : <p className="mt-4">해당 고객의 등급 정보가 없습니다.</p>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EvaluationListPage;