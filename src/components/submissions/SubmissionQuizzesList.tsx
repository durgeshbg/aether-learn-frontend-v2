import { getCourseById } from "@/services/course";
import { routes } from "@/static-data/routes";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Brain, Target } from "lucide-react";
import { useParams, Link } from "react-router";

const SubmissionQuizzesList: React.FC = () => {
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
        <h2 className="text-xl font-semibold">Quizzes</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {course.quizzesCount} total
        </span>
      </div>
      <div className="space-y-3">
        {course.quizzesCount === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
            <Brain className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No quizzes available yet.
            </p>
          </div>
        ) : (
          course.quizzes?.map((quiz, index) => (
            <Link
              key={quiz.id}
              to={routes.COURSE_SUBMISSIONS_QUIZ_DETAILS(courseId, quiz.id)}
              className="flex items-center gap-4 rounded-lg border border-border/70 px-4 py-3 transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                Q{index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{quiz.title}</p>
                <p className="text-xs text-muted-foreground">
                  Tap to view attempts
                </p>
              </div>
              <Target className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default SubmissionQuizzesList;
