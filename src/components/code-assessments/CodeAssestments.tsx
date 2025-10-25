import { Outlet } from "react-router";

const CodeAssessments = () => {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
      <Outlet />
    </div>
  );
};

export default CodeAssessments;
