import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getEvaluationItems, submitClientEvaluation } from '@/api/api';
import type { EvaluationItem, EvaluationSubmitPayload } from '@/types/evaluation';

// 평가자 ID는 현재 로그인 시스템이 없으므로 고정값으로 사용합니다.
const MOCK_EMPLOYEE_ID = 10013; 

/**
 * 선택된 프로젝트에 대한 고객 신용 평가를 입력하고 제출하는 페이지 컴포넌트입니다.
 */
function EvaluationPage() {
  // React Router 훅을 사용하여 URL 파라미터, location state, 페이지 이동 함수를 가져옵니다.
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- 상태 관리 ---
  // 각 평가 항목별 점수를 저장하는 상태 (key: 항목 코드, value: 점수)
  const [scores, setScores] = useState<Record<number, string>>({});
  // 이전 페이지에서 전달받은 프로젝트 및 고객 정보를 상태로 관리
  const { clientName, projectName } = location.state || {};
  const [clientId, setClientId] = useState<number | null>(null);

  // 1. useQuery를 사용하여 평가 항목 목록을 API로부터 가져옵니다.
  const { data: items = [], isLoading: isLoadingItems, error: itemsError } = useQuery({
    queryKey: ['evaluationItems'],
    queryFn: getEvaluationItems,
  });

  // 2. useMutation을 사용하여 평가 제출 API를 호출합니다.
  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: (data: EvaluationSubmitPayload) => submitClientEvaluation(data),
    onSuccess: () => {
      toast.success("평가가 성공적으로 제출되었습니다.");
      // 'completedProjects' 쿼리를 무효화하여 목록 페이지가 최신 데이터를 다시 불러오도록 합니다.
      queryClient.invalidateQueries({ queryKey: ['completedProjects', MOCK_EMPLOYEE_ID] });
      navigate('/evaluation'); // 목록 페이지로 이동
    },
    onError: (error) => {
      toast.error(`제출 중 오류가 발생했습니다: ${error.message}`);
    },
  });

  useEffect(() => {
    // 이전 페이지에서 navigate state로 전달받은 clientId를 설정합니다.
    if (location.state?.clientId) {
      setClientId(location.state.clientId);
    } else {
      console.error("고객 정보가 없습니다. 프로젝트 목록으로 돌아가세요.");
      toast.error("잘못된 접근입니다. 목록 페이지로 돌아갑니다.");
      navigate('/evaluation');
    }
  }, [location.state, navigate]);

  // 평가 항목이 로드되면 점수 상태를 초기화합니다.
  useEffect(() => {
    if (items.length > 0) {
      const initialScores = Object.fromEntries(items.map(item => [item.client_item_code, '']));
      setScores(initialScores);
    }
  }, [items]);

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
    const isAllScoresEntered = items.every(item => scores[item.client_item_code]?.trim() !== '');
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

    submit(submissionData); // useMutation으로 API 호출 실행
  };

  /**
   * '취소' 버튼 클릭 시, 목록 페이지로 돌아가는 핸들러입니다.
   */
  const handleCancel = () => {
    setScores(prevScores => ({
      ...prevScores,
    }));
    navigate('/evaluation'); // 목록 페이지로 이동
  };

  if (isLoadingItems) {
    return <div className="container mx-auto p-4">평가 항목을 불러오는 중입니다...</div>;
  }

  if (itemsError) return <div className="container mx-auto p-4">오류: {itemsError.message}</div>;

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
          <Button type="submit" form="evaluation-form" disabled={isSubmitting}>{isSubmitting ? '제출 중...' : '제출'}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default EvaluationPage;