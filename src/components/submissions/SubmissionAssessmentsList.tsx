import { getCourseById } from "@/services/course";
import { routes } from "@/static-data/routes";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Code, FileText } from "lucide-react";
import { Link, useParams } from "react-router";

const SubmissionAssessmentsList = () => {
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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Code assessments</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {course.codeAssessmentsCount} total
        </span>
      </div>
      <div className="space-y-3">
        {course.codeAssessmentsCount === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
            <Code className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No assessments available yet.
            </p>
          </div>
        ) : (
          course.codeAssessments?.map((assessment, index) => (
            <Link
              key={assessment.id}
              to={routes.COURSE_SUBMISSIONS_CODE_ASSESSMENT_DETAILS(
                courseId,
                assessment.id
              )}
              className="flex items-center gap-4 rounded-lg border border-border/70 px-4 py-3 transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                C{index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {assessment.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tap to view submissions
                </p>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default SubmissionAssessmentsList;
