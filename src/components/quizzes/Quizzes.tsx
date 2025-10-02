import type { Dispatch, SetStateAction } from "react";
import { Outlet, useOutletContext } from "react-router";

const Quizzes = () => {
  const [setHideNavbar] =
    useOutletContext<[Dispatch<SetStateAction<boolean>>]>();

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden min-h-[500px]">
      <Outlet context={[setHideNavbar]} />
    </div>
  );
};

export default Quizzes;
