import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeProject, EvaluationItem, EvaluationSubmission } from "@/types/evaluation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface EvaluationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: EmployeeProject;
  onSubmitSuccess: () => void;
}

// API 함수: 평가 항목 목록 가져오기 (실제 API 주소로 변경 필요)
const fetchEvaluationItems = async (): Promise<EvaluationItem[]> => {
  // const response = await fetch('/api/evaluation-items');
  // if (!response.ok) throw new Error('평가 항목을 불러오는데 실패했습니다.');
  // return response.json();

  // --- 더미 데이터 ---
  return [
    { id: 101, name: "요구사항 이해도" },
    { id: 102, name: "의사소통 능력" },
    { id: 103, name: "프로젝트 기여도" },
    { id: 104, name: "마감일 준수" },
  ];
};

// API 함수: 평가 결과 제출하기 (실제 API 주소로 변경 필요)
const submitEvaluation = async (data: EvaluationSubmission): Promise<void> => {
  console.log("서버로 제출할 데이터:", data);
  // const response = await fetch('/api/evaluations', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('평가 제출에 실패했습니다.');

  // --- 더미 데이터 ---
  await new Promise(resolve => setTimeout(resolve, 500));
};

const EvaluationFormModal = ({ isOpen, onClose, project, onSubmitSuccess }: EvaluationFormModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [scores, setScores] = useState<Record<number, number>>({});

  const { data: items, isLoading: isLoadingItems, error: itemsError } = useQuery<EvaluationItem[]>({
    queryKey: ["evaluationItems"],
    queryFn: fetchEvaluationItems,
  });

  const mutation = useMutation({
    mutationFn: submitEvaluation,
    onSuccess: () => {
      toast({ title: "성공", description: "평가가 성공적으로 제출되었습니다." });
      // 'myCompletedProjects' 쿼리를 무효화하여 목록을 새로고침합니다.
      queryClient.invalidateQueries({ queryKey: ["myCompletedProjects"] });
      onSubmitSuccess();
    },
    onError: (error) => {
      toast({ title: "오류", description: `제출 중 오류가 발생했습니다: ${error.message}`, variant: "destructive" });
    },
  });

  const handleScoreChange = (itemId: number, score: number) => {
    setScores(prev => ({ ...prev, [itemId]: score }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!items || Object.keys(scores).length !== items.length) {
      toast({ title: "알림", description: "모든 항목에 점수를 입력해주세요.", variant: "destructive" });
      return;
    }

    const submissionData: EvaluationSubmission = {
      projectId: project.id,
      results: Object.entries(scores).map(([itemId, score]) => ({
        itemId: Number(itemId),
        score,
      })),
    };
    mutation.mutate(submissionData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>'{project.name}' 고객 평가</DialogTitle>
          <DialogDescription>각 항목에 대해 1점부터 5점까지 점수를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {isLoadingItems && <div>항목 로딩 중...</div>}
            {itemsError && <div className="text-red-500">항목 로딩 오류: {itemsError.message}</div>}
            {items?.map(item => (
              <div key={item.id} className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`score-${item.id}`} className="text-right">{item.name}</Label>
                <Input id={`score-${item.id}`} type="number" min="1" max="5" required className="col-span-2" onChange={e => handleScoreChange(item.id, parseInt(e.target.value, 10))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>취소</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? '제출 중...' : '제출'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationFormModal;