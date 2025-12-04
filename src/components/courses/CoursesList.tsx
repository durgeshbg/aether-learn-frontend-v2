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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const gridContent = (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseItem
          key={course.id}
          course={course}
          courseProgress={progressData?.find((p) => p.course.id === course.id)}
          onCourseClick={handleCourseClick}
        />
      ))}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Catalog overview
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Available courses
            </h2>
            <p className="text-muted-foreground">
              Discover recommended learning paths and continue where you left
              off.
            </p>
          </div>
        </div>
      </header>

      {courses.length > 0 ? (
        gridContent
      ) : (
        <Card className="border border-dashed">
          <CardHeader className="items-center text-center">
            <span className="rounded-full bg-muted p-3 text-muted-foreground">
              <BookOpen className="h-6 w-6" />
            </span>
            <CardTitle className="text-xl">No courses available</CardTitle>
            <CardDescription>
              Check back later or contact your administrator to assign content.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Once courses are assigned to your organization they will appear
            here.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoursesList;
