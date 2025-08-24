import { Outlet } from "react-router";

const Modules = () => {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden min-h-[500px]">
      <Outlet />
    </div>
  );
};

export default Modules;
