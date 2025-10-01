import type { CourseProgress } from "@/types/User";

export const getCourseProgressStats = (progress: CourseProgress[]) => {
  let totalCompletedQuizzes = 0;
  let totalCompletedAssignments = 0;
  let avgCompletionRate = 0;

  progress.forEach((course) => {
    totalCompletedQuizzes += course.completedQuizzes.length;
    totalCompletedAssignments += course.completedAssessments.length;
    avgCompletionRate += course.completionRate;
  });

  avgCompletionRate = progress.length
    ? parseFloat((avgCompletionRate / progress.length).toFixed(2))
    : 0;

  return {
    totalCompletedQuizzes,
    totalCompletedAssignments,
    avgCompletionRate,
  };
};

export const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 60) return "bg-yellow-500";
  return "bg-red-500";
};
