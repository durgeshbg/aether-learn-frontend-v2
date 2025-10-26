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
    <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
      {codeSolutions.length === 0 ? (
        <div className="text-center py-8">
          <Code className="h-12 w-12 text-white/30 mx-auto mb-3" />
          <p className="text-white/60">No code submissions available</p>
          <p className="text-white/40 text-sm">
            You have not attempted this code assessment yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {codeSolutions?.map((solution) => (
            <div
              key={solution.id}
              onClick={() => handleCodeSolutionClick(solution.id)}
              className="block p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                    solution.type === "RUN"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {solution.type === "RUN" ? "R" : "S"}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {solution.type === "RUN" ? "Run type" : "Submission"}
                  </h3>
                  <div className="text-white/60 text-xs">
                    {lastTimeAgo(solution.createdAt)} • Click to view details
                  </div>
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    solution.status === "SUBMITTED"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}
                >
                  {solution.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CodeSolutions;
