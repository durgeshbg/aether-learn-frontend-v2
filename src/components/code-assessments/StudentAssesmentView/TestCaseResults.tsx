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
    <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl overflow-y-scroll h-[35vh]">
      <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 backdrop-blur-md bg-white/5 z-10">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-blue-400" />
          <span className="text-white font-medium">Test Results</span>
          {!isRunning && (
            <span
              className={`text-sm px-2 py-1 rounded-lg ${
                passedTests === totalTests
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {passedTests}/{totalTests} passed
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3 h-full">
        {isRunning ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/70">Running test cases...</p>
          </div>
        ) : (
          testResults?.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.passed
                  ? "bg-emerald-500/10 border-emerald-400/30"
                  : "bg-red-500/10 border-red-400/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.passed ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    result.passed ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  Test Case {index + 1}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-white/70">Input:</span>
                  <span className="text-white/90 ml-2 font-mono">
                    {result.testCase.input}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Expected:</span>
                  <span className="text-emerald-300 ml-2 font-mono">
                    {result.testCase.expected}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Output:</span>
                  <span
                    className={`ml-2 font-mono ${
                      result.status === "ACCEPTED"
                        ? "text-emerald-300"
                        : "text-red-300"
                    }`}
                  >
                    {result.stdout}
                  </span>
                </div>
                {result.stderr && (
                  <div>
                    <span className="text-red-400">Error:</span>
                    <span className="text-red-300 ml-2 font-mono">
                      {result.stderr}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestCaseResults;
