/**
 * 종료된 프로젝트 목록의 개별 프로젝트 데이터 구조를 정의합니다.
 */
export interface ProjectForEvaluation {
  project_id: number;
  project_name: string;
  end_date: string;
  client_id: number;
  client_name: string;
  eval_status: "완료" | "미완료";
}

/**
 * 고객 신용 평가 항목의 데이터 구조를 정의합니다.
 */
export interface EvaluationItem {
  client_item_code: number;
  item_name: string;
}

/**
 * 고객 평가 등록 시 API에 전송하는 요청 Body의 데이터 구조를 정의합니다.
 */
export interface EvaluationSubmitPayload {
  evaluator_employee_id: number;
  project_id: number;
  client_id: number;
  scores: {
    client_item_code: number;
    score: number;
  }[];
}

/**
 * 고객 등급 조회 API의 응답 데이터 구조를 정의합니다.
 */
export interface ClientGrade {
  client_id: number;
  average_score: number;
  grade: string;
  priority: number;
}