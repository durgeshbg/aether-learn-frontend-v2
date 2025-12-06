import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { codeSolutionKeys } from "@/tanstack/keys/code-solution";
import { getCodeSolutionById } from "@/services/code-solution";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { getCodeAssessmentById } from "@/services/code-assesment";
import { FileX } from "lucide-react";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      codeSolutionId
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
    if (codeSolution.status === "SUBMITTED") {
      return "Submitted";
    }
    if (codeSolution.status === "GRADED") {
      return "Graded";
    }
    return codeSolution.status;
  }, [codeSolution.status]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardDescription>Code submission</CardDescription>
            <CardTitle className="text-3xl">
              {codeAssessment?.title || "Solution details"}
            </CardTitle>
          </div>
          <Button size="sm" variant="outline">
            View assessment
          </Button>
        </CardHeader>
        <CardContent>
          {codeSolution ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Status", value: statusBadge },
                { label: "Type", value: codeSolution.type },
                {
                  label: "Submitted date",
                  value: new Date(codeSolution.createdAt).toLocaleDateString(),
                },
                {
                  label: "Submitted time",
                  value: new Date(codeSolution.createdAt).toLocaleTimeString(),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-border/70 px-3 py-2"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
              <FileX className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No solution found for this assessment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {codeSolution && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Submitted code</CardTitle>
              <CardDescription>
                Review the code and its execution results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/70 bg-zinc-950/95 p-4 text-sm leading-relaxed text-muted-foreground">
                <pre className="overflow-x-auto whitespace-pre-wrap">
                  <code>{codeSolution.code}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {codeSolution.testCaseResults && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Test case results</CardTitle>
                <CardDescription>
                  Execution details across all cases.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {codeSolution.testCaseResults.map((result, idx) => (
                  <div
                    key={result.id}
                    className="rounded-lg border border-border/70 p-4"
                  >
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                      <div>Test #{idx + 1}</div>
                      <span>{result.status.replaceAll("_", " ")}</span>
                    </div>
                    <div className="mt-3 grid gap-3 text-xs text-muted-foreground md:grid-cols-2">
                      <div>
                        <p className="mb-1 font-medium">Input</p>
                        <pre className="rounded bg-muted/50 p-2">
                          {result.testCase.input}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-1 font-medium">Expected output</p>
                        <pre className="rounded bg-muted/50 p-2">
                          {result.testCase.expected}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-1 font-medium">Your output</p>
                        <pre className="rounded bg-muted/50 p-2">
                          {result.stdout || "(no output)"}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-1 font-medium">Error output</p>
                        <pre className="rounded bg-muted/50 p-2">
                          {result.stderr || "(no error)"}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default CodeSolutionDetails;
