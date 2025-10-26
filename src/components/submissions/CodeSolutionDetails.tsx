import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { codeSolutionKeys } from "@/tanstack/keys/code-solution";
import { getCodeSolutionById } from "@/services/code-solution";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { getCodeAssessmentById } from "@/services/code-assesment";
import { FileText, FileX, Terminal, CheckCircle } from "lucide-react";
import { useMemo } from "react";

const statusColorMap: Record<string, string> = {
  ACCEPTED: "text-green-400 bg-green-400/10 border-green-400/20",
  WRONG_ANSWER: "text-red-400 bg-red-400/10 border-red-400/20",
  TIME_LIMIT_EXCEEDED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  COMPILATION_ERROR: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  PROCESSING: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  IN_QUEUE: "text-white/60 bg-white/10 border-white/10",
};

const CodeSolutionDetails = () => {
  const {
    courseId = "",
    codeAssessmentId = "",
    codeSolutionId = "",
  } = useParams<{
    courseId: string;
    codeAssessmentId: string;
    codeSolutionId: string;
  }>();

  const { data: codeSolution } = useSuspenseQuery({
    queryKey: codeSolutionKeys.getById(
      courseId,
      codeAssessmentId,
      codeSolutionId,
    ),
    queryFn: async () => {
      return getCodeSolutionById(axiosInstance, {
        courseId,
        codeAssessmentId,
        id: codeSolutionId,
      });
    },
    select: (data) => data.codeSolution,
  });

  const { data: codeAssessment } = useSuspenseQuery({
    queryKey: codeAssessmentKeys.getById(courseId, codeAssessmentId),
    queryFn: async () => {
      return getCodeAssessmentById(axiosInstance, {
        courseId,
        id: codeAssessmentId,
      });
    },
    select: (data) => data?.codeAssessment,
  });

  const statusBadge = useMemo(() => {
    switch (codeSolution.status) {
      case "SUBMITTED":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
            Submitted
          </span>
        );
      case "GRADED":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
            Graded
          </span>
        );
      default:
        return null;
    }
  }, [codeSolution.status]);

  return (
    <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-white">
        <FileText className="h-5 w-5 text-purple-400" />
        Code Solution Details
      </h2>

      {codeSolution ? (
        <div className="space-y-6">
          {/* Solution Info */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-white/60 text-sm font-medium mb-1">
                  Assessment Title
                </div>
                <div className="text-white font-medium">
                  {codeAssessment?.title}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm font-medium mb-1">
                  Status
                </div>
                <div className="flex items-center gap-2">{statusBadge}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm font-medium mb-1">
                  Type
                </div>
                <div className="text-white font-medium capitalize">
                  {codeSolution.type.toLowerCase()}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm font-medium mb-1">
                  Submitted At
                </div>
                <div className="text-white font-medium">
                  {new Date(codeSolution.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Code Section */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-white">
              <Terminal className="h-4 w-4 text-purple-400" />
              Submitted Code
            </h3>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-auto text-sm text-white font-mono whitespace-pre-wrap">
              {codeSolution.code}
            </div>
          </div>

          {/* Test Case Results */}
          {codeSolution.testCaseResults && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-white">
                <CheckCircle className="h-4 w-4 text-purple-400" />
                Test Case Results
              </h3>
              <div className="space-y-4">
                {codeSolution.testCaseResults.map((result, idx) => (
                  <div
                    key={result.id}
                    className="rounded-xl border p-4 bg-white/5 border-white/10"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-white/80 font-medium">
                        Test #{idx + 1}: {result.testCase.description}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-md border ${statusColorMap[result.status] || "border-white/10"}`}
                      >
                        {result.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Input</div>
                        <pre className="text-white bg-black/40 p-2 rounded-md overflow-x-auto">
                          {result.testCase.input}
                        </pre>
                      </div>
                      <div>
                        <div className="text-white/60">Expected Output</div>
                        <pre className="text-green-400 bg-black/40 p-2 rounded-md overflow-x-auto">
                          {result.testCase.expected}
                        </pre>
                      </div>
                      <div>
                        <div className="text-white/60">Your Output</div>
                        <pre className="text-blue-400 bg-black/40 p-2 rounded-md overflow-x-auto">
                          {result.stdout || "(no output)"}
                        </pre>
                      </div>
                      <div>
                        <div className="text-white/60">Error Output</div>
                        <pre className="text-red-400 bg-black/40 p-2 rounded-md overflow-x-auto">
                          {result.stderr || "(no error)"}
                        </pre>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs text-white/60">
                      <div>Time: {result.time}s</div>
                      <div>Memory: {result.memory} KB</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileX className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 text-lg font-medium">No solution found</p>
          <p className="text-white/40 text-sm">
            This assessment has not been submitted yet
          </p>
        </div>
      )}
    </section>
  );
};

export default CodeSolutionDetails;
