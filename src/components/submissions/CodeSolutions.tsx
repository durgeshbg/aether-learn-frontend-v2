import { getCodeSolutions } from "@/services/code-solution";
import { routes } from "@/static-data/routes";
import { codeSolutionKeys } from "@/tanstack/keys/code-solution";
import { axiosInstance } from "@/utils/axiosInstance";
import lastTimeAgo from "@/utils/lastTimeAgo";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Code } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const CodeSolutions = () => {
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId: string;
  }>();
  const navigate = useNavigate();

  const { data: codeSolutions } = useSuspenseQuery({
    queryKey: codeSolutionKeys.all(courseId, codeAssessmentId),
    queryFn: async () => {
      return getCodeSolutions(axiosInstance, {
        courseId,
        codeAssessmentId,
      });
    },
    select: (data) => data.codeSolutions,
  });

  const handleCodeSolutionClick = (codeSolutionId: string) => {
    navigate(
      routes.COURSE_SUBMISSIONS_CODE_SOLUTION_DETAILS(
        courseId,
        codeAssessmentId,
        codeSolutionId,
      ),
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Code submissions</h3>
          <p className="text-sm text-muted-foreground">
            {codeSolutions.length} submissions found.
          </p>
        </div>
      </div>
      {codeSolutions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
          <Code className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No code submissions yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {codeSolutions?.map((solution) => (
            <button
              key={solution.id}
              onClick={() => handleCodeSolutionClick(solution.id)}
              className="flex w-full items-center gap-4 rounded-lg border border-border/70 px-4 py-3 text-left transition-colors hover:border-primary/40"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  solution.type === "RUN"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {solution.type === "RUN" ? "R" : "S"}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {solution.type === "RUN" ? "Run" : "Submission"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lastTimeAgo(solution.createdAt)} • Tap to view details
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  solution.status === "SUBMITTED"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                {solution.status}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default CodeSolutions;
