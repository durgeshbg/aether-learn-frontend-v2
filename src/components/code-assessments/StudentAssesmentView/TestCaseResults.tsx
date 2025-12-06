import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TestCaseResult } from "@/types/TestCaseResult";
import { CheckCircle, Terminal, XCircle } from "lucide-react";

interface TestCasesViewProps {
  isRunning: boolean;
  testResults?: TestCaseResult[];
}

const TestCaseResults = ({ isRunning, testResults }: TestCasesViewProps) => {
  const passedTests = testResults?.filter((result) => result.passed).length;
  const totalTests = testResults?.length;

  return (
    <Card className="h-full border border-border/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">Test results</CardTitle>
          {!isRunning && totalTests ? (
            <span
              className={`text-xs font-medium ${
                passedTests === totalTests ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {passedTests}/{totalTests} passed
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="h-full space-y-3 overflow-y-scroll max-h-[340px]">
        {isRunning ? (
          <div className="flex flex-col items-center gap-3 py-6 text-sm text-muted-foreground">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
            Running test cases…
          </div>
        ) : (
          testResults?.map((result, index) => (
            <div
              key={index}
              className="rounded-lg border border-border/70 p-3 text-xs leading-normal"
            >
              <div className="mb-2 flex items-center gap-2">
                {result.passed ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="font-medium text-foreground">
                  Test case {index + 1}
                </span>
              </div>
              <div className="space-y-1 font-mono">
                <div className="text-muted-foreground">
                  Input:{" "}
                  <span className="text-foreground">
                    {result.testCase.input}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Expected:{" "}
                  <span className="text-foreground">
                    {result.testCase.expected}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Output:{" "}
                  <span
                    className={
                      result.status === "ACCEPTED"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }
                  >
                    {result.stdout}
                  </span>
                </div>
                {result.stderr && (
                  <div className="text-red-500">
                    Error: <span>{result.stderr}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseResults;
