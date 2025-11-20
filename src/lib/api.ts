// 테스트용 고정 직원 ID
const EMPLOYEE_ID = 10002;

// API 명세서 1: 종료된 프로젝트 조회 API
export const fetchCompletedProjects = async () => {
  // 백엔드 서버가 8000번 포트에서 실행 중이라고 가정합니다.
  const response = await fetch(`http://127.0.0.1:8000/api/client-evaluations/projects?employee_id=${EMPLOYEE_ID}`);
  if (!response.ok) {
    throw new Error('종료된 프로젝트 목록을 불러오는데 실패했습니다.');
  }
  return response.json();
};