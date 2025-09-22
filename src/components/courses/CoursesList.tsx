import { useAuth } from "@/hooks/useAuth";
import { getCourses } from "@/services/course";
import { routes } from "@/static-data/routes";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { BookOpen } from "lucide-react";
import { enrollUserInCourse, getUserProgress } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import CourseItem from "./CourseItem";

const CoursesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: courses } = useSuspenseQuery({
    queryKey: courseKeys.all(),
    queryFn: async () => {
      return getCourses(axiosInstance, {
        organizationId: user?.organization?.id,
      });
    },
    select: (data) => data.courses,
  });

  const { mutate: enrollCourseMutation } = useMutation({
    mutationKey: userKeys.enrollCourse(),
    mutationFn: async (courseId: string) => {
      return enrollUserInCourse(axiosInstance, { courseId, enroll: true });
    },
    meta: {
      notify: true,
      successMessage: "Enrolled in course successfully!",
      invalidatesQueries: [courseKeys.all()],
    },
  });

  const { data: progressData } = useQuery({
    queryKey: userKeys.getProgress(user?.id || ""),
    queryFn: async () => {
      return getUserProgress(axiosInstance, { id: user?.id || "" });
    },
    select: (data) => data.progress,
  });

  const handleCourseClick = (courseId: string) => {
    if (
      user?.role === "ADMIN" ||
      user?.orgAdminOf?.id === user?.organization?.id ||
      courses.find((c) => c.id === courseId)?.enrolled
    ) {
      navigate(routes.COURSE_DETAILS(courseId));
    } else {
      enrollCourseMutation(courseId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Available Courses
        </h2>
        <p className="text-white/70">
          Discover and continue your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            courseProgress={progressData?.find(
              (p) => p.course.id === course.id,
            )}
            onCourseClick={handleCourseClick}
          />
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/80 mb-2">
            No Courses Available
          </h3>
          <p className="text-white/60">
            Check back later for new courses or contact your administrator.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
