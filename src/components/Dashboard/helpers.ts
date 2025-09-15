import type { Course } from "@/types/Course";
import type { CourseProgress } from "@/types/User";

const getInitialData = () => ({
  completedCoursesCount: 0,
  totalEnrolledCoursesCount: 0,
  sumCompletionRate: 0,
});

export const courseCompletiondata = (progressData: CourseProgress[]) => {
  return progressData
    ? progressData.reduce(
        (
          acc: {
            completedCoursesCount: number;
            totalEnrolledCoursesCount: number;
            sumCompletionRate: number;
          },
          course: CourseProgress,
        ) => {
          if (course.completionRate === 100) {
            acc.completedCoursesCount += 1;
          }
          acc.sumCompletionRate += course.completionRate;
          acc.totalEnrolledCoursesCount += 1;
          return acc;
        },
        {
          ...getInitialData(),
        },
      )
    : {
        ...getInitialData(),
      };
};

export const completionStats = (
  courses: Course[],
  progressData: CourseProgress[],
) => {
  let totalModules = 0;
  let completedModules = 0;
  let totalQuizzes = 0;
  let completedQuizzes = 0;
  let totalCodeAssessments = 0;
  let completedCodeAssessments = 0;

  progressData.forEach((progress) => {
    const course = courses.find((c) => c.id === progress.course.id);
    if (course) {
      totalModules += course.modulesCount || 0;
      completedModules += progress.completedModules.length || 0;
      totalQuizzes += course.quizzesCount || 0;
      completedQuizzes += progress.completedQuizzes.length || 0;
      totalCodeAssessments += course.codeAssessmentsCount || 0;
      completedCodeAssessments += progress.completedAssessments.length || 0;
    }
  });

  return {
    totalModules,
    completedModules,
    totalQuizzes,
    completedQuizzes,
    totalCodeAssessments,
    completedCodeAssessments,
  };
};
