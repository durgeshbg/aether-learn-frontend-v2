import { Outlet } from "react-router";

const Lessons = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default Lessons;
