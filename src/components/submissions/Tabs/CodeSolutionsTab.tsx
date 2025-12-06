import { Outlet } from "react-router";

const CodeSolutionsTab = () => {
  return (
    <div className="space-y-4">
      <Outlet />
    </div>
  );
};

export default CodeSolutionsTab;
