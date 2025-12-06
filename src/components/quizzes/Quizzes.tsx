import type { Dispatch, SetStateAction } from "react";
import { Outlet, useOutletContext } from "react-router";

const Quizzes = () => {
  const outletContext = useOutletContext<[Dispatch<SetStateAction<boolean>>]>();

  return <Outlet context={outletContext} />;
};

export default Quizzes;
