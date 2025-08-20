import { Outlet, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";

const Courses = () => {
  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate(routes.COURSE_CREATE);
  };

  const handleViewCourses = () => {
    navigate(routes.COURSES);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <div className="flex mb-4">
        <Button
          onClick={handleViewCourses}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
        >
          View Courses
        </Button>
        <Button
          onClick={handleAddCourse}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Course
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default Courses;
