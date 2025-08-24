import { Outlet } from "react-router";

const Lessons = () => {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden min-h-[500px]">
      <div className="p-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Lessons;
