import { Outlet, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";

const Modules = () => {
  const { courseId = "", lessonId = "" } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const handleViewModules = () => {
    navigate(routes.LESSON_DETAILS(courseId, lessonId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modules</h1>
      <div className="flex mb-4">
        <Button
          onClick={handleViewModules}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
        >
          View Modules
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default Modules;
