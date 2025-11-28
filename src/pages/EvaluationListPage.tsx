import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCompletedProjects, getClientGrade, type ClientGrade } from '@/api/api';
import type { ProjectWithClientEvalStatus } from '@/types/evaluation';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

// 평가자 ID는 현재 로그인 시스템이 없으므로 고정값으로 사용합니다.
const MOCK_EMPLOYEE_ID = 10013;

/**
 * 종료된 프로젝트 목록을 표시하고, 각 프로젝트에 대한 평가 또는 등급 조회를 수행하는 페이지 컴포넌트입니다.
 */
function EvaluationListPage() {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  // 고객 등급 조회 모달의 열림/닫힘 상태
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  // 모달에 표시할 선택된 고객의 등급 정보
  const [selectedClientGrade, setSelectedClientGrade] = useState<ClientGrade | null>(null);
  // 모달 제목에 표시할 고객사 이름
  const [modalClientName, setModalClientName] = useState('');
  
  // 1. useQuery를 사용하여 종료된 프로젝트 목록을 API로부터 가져옵니다.
  const { data: projects = [], isLoading, error } = useQuery<ProjectWithClientEvalStatus[], Error>({
    // 쿼리 키에 사용자 ID를 포함하여, 사용자별로 캐시가 관리되도록 합니다.
    queryKey: ['completedProjects', MOCK_EMPLOYEE_ID],
    queryFn: () => getCompletedProjects(MOCK_EMPLOYEE_ID),
  });

  /**
   * '평가하기' 버튼 클릭 시, 해당 프로젝트의 평가 페이지로 이동하는 핸들러입니다.
   * @param project 선택된 프로젝트 객체
   */
  const handleEvaluateClick = (project: ProjectWithClientEvalStatus) => {
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
  const handleGradeCheck = async (clientId: number, clientName: string) => {
    try {
      // 1. API로부터 기본 등급 정보를 가져옵니다.
      const apiGradeData = await getClientGrade(clientId);
      // 2. 상태에 저장하기 전에, 인자로 받은 clientId와 clientName을 추가하여
      //    컴포넌트의 state가 기대하는 타입의 객체를 완성합니다.
      const completeGradeData = { ...apiGradeData, client_id: clientId, client_name: clientName };
      
      setSelectedClientGrade(completeGradeData);
      setModalClientName(clientName);
      setIsGradeModalOpen(true);
    } catch (err) {
      toast.error(`등급 조회 중 오류가 발생했습니다: ${err instanceof Error ? err.message : String(err)}`);
      setSelectedClientGrade(null);
    }
  };

  /**
   * end_date가 Date 객체일 경우 'YYYY-MM-DD' 형식의 문자열로 변환합니다.
   * @param date end_date 값 (string 또는 Date)
   * @returns 'YYYY-MM-DD' 형식의 문자열
   */
  const formatDate = (date: string | Date): string => {
    // API 응답으로 받은 날짜는 ISO 형식의 문자열일 수 있습니다.
    const dateObj = new Date(date);
    // 유효한 Date 객체인지 확인합니다.
    if (isNaN(dateObj.getTime())) {
      return String(date); // 유효하지 않으면 원본 문자열 반환
    }
    // 한국 시간 기준(KST)으로 YYYY-MM-DD 형식 변환
    return dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '');
  };

  return (
    <DashboardLayout>
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
              {/* 로딩 및 에러 상태 처리 */}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">프로젝트 목록을 불러오는 중입니다...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">오류: {error.message}</TableCell>
                </TableRow>
              ) : 
              /* 프로젝트 목록을 순회하며 테이블 행을 렌더링합니다. */
              (projects.map((project) => (
                <TableRow key={project.project_id}>
                  <TableCell className="font-medium">{project.project_name}</TableCell>
                  <TableCell>{project.client_name}</TableCell> 
                  <TableCell>{formatDate(project.end_date)}</TableCell>
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
              ))
              )
            }
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
    </DashboardLayout>
  );
}

export default EvaluationListPage;