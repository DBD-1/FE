/**
 * 이 파일은 실제 백엔드 API와 통신하는 함수들을 정의하는 공간입니다.
 * 예를 들어, axios나 fetch를 사용하여 GET, POST 등의 HTTP 요청을 보내는 코드를 작성합니다.
 */

import axios from 'axios';

// 백엔드 API의 기본 URL을 설정합니다.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Axios 인스턴스를 생성합니다.
// baseURL, timeout, headers 등 공통 설정을 할 수 있습니다.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 백엔드에서 데이터를 가져오는 GET 요청 함수의 예시입니다.
 * @param endpoint - 요청할 API의 세부 경로 (예: '/api/data')
 * @returns {Promise<any>} - API 응답 데이터
 */
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await apiClient.get<T>(endpoint);
  return response.data;
};
/**
 * 백엔드로 데이터를 전송하는 POST 요청 함수의 예시입니다.
 * @param endpoint - 요청할 API의 세부 경로 (예: '/api/client-evaluations')
 * @param data - 전송할 데이터 객체
 * @returns {Promise<any>} - API 응답 데이터
 */
export const postData = async (endpoint: string, data: unknown) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};



// @/types/evaluation.ts 에 있어야 할 타입들을 임시로 정의합니다.
export interface ProjectWithClientEvalStatus {
  project_id: number;
  project_name: string;
  client_id: number;
  client_name: string;
  end_date: string;
  eval_status: '완료' | '미완료';
}

export interface EvaluationItem {
  client_item_code: number;
  item_name: string;
}

export interface ClientGrade {
  average_score: number;
  grade: string;
  priority: number;
}

// 백엔드 ClientRanking 모델과 동일한 타입 정의
export interface ClientRanking {
  client_id: number;
  client_name: string;
  average_score: number;
  grade: string;
  rank: number;
}

// --- 고객 평가 관련 API 함수들 ---

/**
 * 종료된 프로젝트 목록을 조회합니다. (GET /api/client-evaluations/projects)
 * @param employeeId - 로그인한 직원의 ID
 */
export const getCompletedProjects = (employeeId: number): Promise<ProjectWithClientEvalStatus[]> => {
  return fetchData<ProjectWithClientEvalStatus[]>(`/api/client-evaluations/projects?employee_id=${employeeId}`);
};

/**
 * 고객 신용 평가 항목 목록을 조회합니다. (GET /api/client-evaluations/items)
 */
export const getEvaluationItems = (): Promise<EvaluationItem[]> => {
  return fetchData<EvaluationItem[]>('/api/client-evaluations/items');
};

/**
 * 고객 평가를 등록합니다. (POST /api/client-evaluations)
 * @param evaluationData - 등록할 평가 데이터
 */
export const submitClientEvaluation = (evaluationData: unknown) => {
  return postData('/api/client-evaluations', evaluationData);
};

/**
 * 특정 고객의 등급 및 우선순위를 조회합니다. (GET /api/clients/{client_id}/grade)
 * @param clientId - 조회할 고객의 ID
 */
export const getClientGrade = (clientId: number): Promise<ClientGrade> => {
  return fetchData<ClientGrade>(`/api/clients/${clientId}/grade`);
};

/**
 * 고객 신용 평가 순위 목록을 조회하는 API
 * GET /ranking
 */
export const getClientRankings = (): Promise<ClientRanking[]> => {
  return fetchData<ClientRanking[]>("/api/client-evaluations/ranking");
};
