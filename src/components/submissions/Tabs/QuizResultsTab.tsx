import { Outlet } from "react-router";

const QuizResultsTab = () => {
  return (
    <div className="space-y-4">
      <Outlet />
    </div>
  );
};

export default QuizResultsTab;
