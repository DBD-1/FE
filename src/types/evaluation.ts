/**
 * 직원이 참여한 프로젝트의 정보를 나타냅니다.
 */
export interface EmployeeProject {
  id: number;
  name: string;
  endDate: string; // 종료 날짜 (예: "2025-11-18")
  evaluationStatus: "COMPLETED" | "PENDING"; // 평가 완료 | 미완료
}

/**
 * 고객 신용 평가 항목의 정보를 나타냅니다.
 */
export interface EvaluationItem {
  id: number;
  name: string; // 항목 이름 (예: "의사소통 능력")
}

/**
 * 평가 점수 제출 시 서버로 보낼 데이터 구조입니다.
 */
export interface EvaluationSubmission {
  projectId: number;
  results: {
    itemId: number;
    score: number;
  }[];
}