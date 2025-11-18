import ProjectEvaluationList from "@/components/evaluation/ProjectEvaluationList";

/**
 * 고객 평가 메인 페이지
 * 직원이 참여한 프로젝트 목록을 보여주고 평가를 시작하는 페이지입니다.
 */
const Evaluation = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">고객 평가</h1>
      <ProjectEvaluationList />
    </div>
  );
};

export default Evaluation;