import { getCourseById } from "@/services/course";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router";

const CodeSolutionsTab = () => {
  const { courseId = "" } = useParams<{
    courseId: string;
  }>();

  const { data: course } = useSuspenseQuery({
    queryKey: courseKeys.getById(courseId),
    queryFn: async () => {
      return getCourseById(axiosInstance, { id: courseId });
    },
    select: (data) => data.course,
  });

  return (
    <div className="mt-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
        Code Submissions: {course?.name}
      </h2>
      <Outlet />
    </div>
  );
};

export default CodeSolutionsTab;
