import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import mockEvaluationItems from '@/mocks/evaluationItems.json'; // Mock 데이터 import
import type { EvaluationItem, EvaluationSubmitPayload, ProjectForEvaluation } from '@/types/evaluation';

// 평가자 ID는 현재 로그인 시스템이 없으므로 고정값으로 사용합니다.
const MOCK_EMPLOYEE_ID = 10002; 

/**
 * 선택된 프로젝트에 대한 고객 신용 평가를 입력하고 제출하는 페이지 컴포넌트입니다.
 */
function EvaluationPage() {
  // React Router 훅을 사용하여 URL 파라미터, location state, 페이지 이동 함수를 가져옵니다.
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // --- 상태 관리 ---
  // 평가 항목 목록을 저장하는 상태
  const [items, setItems] = useState<EvaluationItem[]>([]);
  // 각 평가 항목별 점수를 저장하는 상태 (key: 항목 코드, value: 점수)
  const [scores, setScores] = useState<Record<number, string>>({});
  // 이전 페이지에서 전달받은 프로젝트 및 고객 정보를 상태로 관리
  const { clientName, projectName } = location.state || {};
  const [clientId, setClientId] = useState<number | null>(null);

  useEffect(() => {
    // 컴포넌트 마운트 시, 평가 항목을 Mock 데이터로 설정합니다.
    setItems(mockEvaluationItems);
    
    // 모든 평가 항목의 점수를 빈 문자열로 초기화합니다.
    const initialScores: Record<number, string> = {};
    mockEvaluationItems.forEach((item) => {
      initialScores[item.client_item_code] = '';
    });
    setScores(initialScores);

    // 이전 페이지에서 navigate state로 전달받은 clientId를 설정합니다.
    // 이 값이 없으면 평가를 진행할 수 없으므로 목록 페이지로 돌려보냅니다.
    if (location.state?.clientId) {
      setClientId(location.state.clientId);
    } else {
      console.error("고객 정보가 없습니다. 프로젝트 목록으로 돌아가세요.");
      navigate('/evaluation');
    }
  }, [projectId, location.state, navigate]);

  /**
   * 점수 입력 필드의 값이 변경될 때 호출되는 핸들러입니다.
   * @param itemCode 변경된 항목의 코드
   * @param value 입력된 값
   */
  const handleScoreChange = (itemCode: number, value: string) => {
    // 숫자만 입력받도록 처리하고, 0~100 사이의 값만 허용합니다.
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '' || (parseInt(numericValue, 10) >= 0 && parseInt(numericValue, 10) <= 100)) {
      setScores(prevScores => ({
        ...prevScores,
        [itemCode]: numericValue
      }));
    }
  };

  /**
   * 점수 입력 필드에서 포커스가 벗어났을 때 호출되는 핸들러입니다.
   * @param itemCode 포커스가 벗어난 항목의 코드
   * @param value 입력된 값
   */
  const handleBlur = (itemCode: number, value: string) => {
    if (parseInt(value, 10) > 100) {
      setScores(prevScores => ({
        ...prevScores,
        [itemCode]: '100'
      }));
    }
  };

  /**
   * '제출' 버튼 클릭 시, 평가 데이터를 생성하고 API 호출을 시뮬레이션하는 핸들러입니다.
   */
  const handleSubmit = async () => {
    if (!clientId || !projectId) {
      toast.error("고객 또는 프로젝트 정보가 올바르지 않습니다. 목록으로 돌아가 다시 시도해주세요.");
      return;
    }

    // 모든 항목의 점수가 입력되었는지 유효성을 검사합니다.
    const isAllScoresEntered = items.every(item => scores[item.client_item_code] && scores[item.client_item_code] !== '');
    if (!isAllScoresEntered) {
      toast.warning("모든 평가 항목의 점수를 입력해주세요.");
      return;
    }

    // API 요청 명세에 따라 제출할 데이터를 구성합니다.
    const submissionData: EvaluationSubmitPayload = {
      evaluator_employee_id: MOCK_EMPLOYEE_ID,
      project_id: parseInt(projectId, 10),
      client_id: clientId,
      scores: Object.keys(scores).map(itemCode => ({
        client_item_code: parseInt(itemCode, 10),
        score: parseInt(scores[parseInt(itemCode, 10)], 10) || 0,
      }))
    };

    // 1. API 호출 시뮬레이션: 콘솔에 제출 데이터를 출력합니다.
    console.log("제출 데이터 (시뮬레이션):", submissionData);
    toast.success("평가가 성공적으로 제출되었습니다. (시뮬레이션)");
    
    // 2. 프론트엔드 상태 업데이트: sessionStorage의 데이터를 수정하여 목록 페이지에 즉시 반영되도록 합니다.
    const storedProjects = sessionStorage.getItem('completedProjects');
    if (storedProjects) {
      let projects: ProjectForEvaluation[] = JSON.parse(storedProjects);
      // 현재 평가한 프로젝트를 찾아 eval_status를 '완료'로 변경합니다.
      projects = projects.map(p => 
        p.project_id === parseInt(projectId, 10) 
          ? { ...p, eval_status: '완료' } 
          : p
      );
      // 변경된 목록을 다시 sessionStorage에 저장합니다.
      sessionStorage.setItem('completedProjects', JSON.stringify(projects));
    }

    // 3. 작업 완료 후, 목록 페이지로 이동합니다.
    navigate('/evaluation');
  };

  /**
   * '취소' 버튼 클릭 시, 목록 페이지로 돌아가는 핸들러입니다.
   */
  const handleCancel = () => {
    setScores(prevScores => ({
      ...prevScores
    }));
    navigate('/evaluation'); // 목록 페이지로 이동
  };

  return (
    <div className="container mx-auto p-4">
      {/* 평가 입력 폼 카드 UI */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>고객 평가 입력</CardTitle>
          <CardDescription>
            프로젝트: {projectName || `ID: ${projectId}`} ({clientName || '고객 정보 없음'})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="evaluation-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="grid w-full items-center gap-4">
              {/* 평가 항목 목록을 순회하며 입력 필드를 렌더링합니다. */}
              {items.map((item: EvaluationItem) => (
                <div key={item.client_item_code} className="flex flex-col space-y-1.5">
                  <Label htmlFor={`score-${item.client_item_code}`}>{item.item_name}</Label>
                  <Input
                    id={`score-${item.client_item_code}`}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0 ~ 100점 사이로 입력"
                    value={scores[item.client_item_code] || ''}
                    onChange={(e) => handleScoreChange(item.client_item_code, e.target.value)}
                    onBlur={(e) => handleBlur(item.client_item_code, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </form>
        </CardContent>
        {/* 카드 하단 버튼 영역 */}
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>취소</Button>
          <Button type="submit" form="evaluation-form">제출</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default EvaluationPage;