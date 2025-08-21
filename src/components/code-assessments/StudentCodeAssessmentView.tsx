import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { LANGUAGES_MAP } from "@/static-data/languages";
import type { TestCase } from "@/types/TestCase";
import type { CodeAssesment } from "@/types/CodeAssesment";
import {
  Code2,
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Terminal,
  FileText,
  Maximize2,
  Minimize2,
  Upload,
} from "lucide-react";

interface StudentCodeAssessmentViewProps {
  codeAssessment: CodeAssesment;
  testCases: TestCase[];
  courseId: string;
  codeAssessmentId: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

export const StudentCodeAssessmentView = ({
  codeAssessment,
  testCases,
  codeAssessmentId,
}: StudentCodeAssessmentViewProps) => {
  const navigate = useNavigate();
  const [code, setCode] = useState(codeAssessment.starterCode);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description",
  );
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const language = LANGUAGES_MAP[codeAssessment.languageId];

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      // In real app, save to localStorage or backend
      localStorage.setItem(`code_${codeAssessmentId}`, code);
      setLastSaved(new Date());
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [code, codeAssessmentId]);

  // Load saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${codeAssessmentId}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [codeAssessmentId]);

  // Mock code execution (replace with real backend call)
  const runCode = async () => {
    setIsRunning(true);
    setShowResults(true);

    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResults: TestResult[] = testCases.map((testCase) => {
      const passed = Math.random() > 0.3; // 70% pass rate for demo
      return {
        passed,
        input: testCase.input,
        expected: testCase.expected,
        actual: passed ? testCase.expected : "Wrong output",
        error: passed ? undefined : "Runtime Error: Invalid syntax",
      };
    });

    setTestResults(mockResults);
    setIsRunning(false);
  };

  const submitCode = async () => {
    // In real app, submit to backend for final evaluation
    await runCode();
    // Show submission confirmation
  };

  const resetCode = () => {
    setCode(codeAssessment.starterCode);
    setShowResults(false);
    setTestResults([]);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const passedTests = testResults.filter((result) => result.passed).length;
  const totalTests = testResults.length;

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50" : "w-full max-w-7xl mx-auto py-8 px-4"} bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900`}
    >
      {/* Header */}
      <div className="mb-6">
        {!isFullscreen && (
          <Button
            onClick={() => navigate(-1)}
            className="mb-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {codeAssessment.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span>
                Difficulty: <span className="text-yellow-400">Medium</span>
              </span>
              <span>
                Language:{" "}
                <span className="text-blue-400">{language?.label}</span>
              </span>
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={toggleFullscreen}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2 rounded-lg transition-all duration-300"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={resetCode}
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-400/30 px-3 py-2 rounded-lg transition-all duration-300"
            >
              <RotateCcw className="h-3 w-3 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6 h-full">
        {/* Left Panel - Problem Description */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "description"
                  ? "text-white bg-white/10 border-b-2 border-blue-400"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Description
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "submissions"
                  ? "text-white bg-white/10 border-b-2 border-blue-400"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Submissions
            </button>
          </div>

          <div
            className="p-6 overflow-y-auto"
            style={{ height: isFullscreen ? "calc(100vh - 200px)" : "500px" }}
          >
            {activeTab === "description" ? (
              <div className="space-y-6">
                {/* Problem Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Problem
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {codeAssessment.description}
                  </p>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Instructions
                  </h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                      {codeAssessment.instructions}
                    </p>
                  </div>
                </div>

                {/* Example Test Cases */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Examples
                  </h3>
                  <div className="space-y-4">
                    {testCases.slice(0, 2).map((testCase, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="font-medium text-white mb-2">
                          Example {index + 1}:
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-white/70">Input:</span>
                            <pre className="text-emerald-400 font-mono mt-1">
                              {testCase.input}
                            </pre>
                          </div>
                          <div>
                            <span className="text-white/70">Output:</span>
                            <pre className="text-blue-400 font-mono mt-1">
                              {testCase.expected}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Constraints
                  </h3>
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30">
                    <ul className="text-yellow-200 text-sm space-y-1">
                      <li>• Time limit: 2 seconds</li>
                      <li>• Memory limit: 256 MB</li>
                      <li>• Use only standard library functions</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Your Submissions
                </h3>
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60">No submissions yet</p>
                  <p className="text-white/40 text-sm">
                    Submit your solution to see results here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor and Results */}
        <div className="space-y-4">
          {/* Code Editor */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span className="text-white font-medium">Code Editor</span>
                <span className="text-white/60 text-sm">
                  ({language?.label})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </>
                  )}
                </Button>
                <Button
                  onClick={submitCode}
                  disabled={isRunning}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>

            <div className="relative">
              <textarea
                ref={codeEditorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-4 bg-gray-900/50 text-white font-mono text-sm leading-relaxed resize-none focus:outline-none"
                style={{
                  height: isFullscreen ? "calc(50vh - 100px)" : "300px",
                }}
                placeholder="Write your solution here..."
                spellCheck={false}
              />

              {/* Line numbers would go here in a real editor */}
              <div className="absolute top-4 left-2 text-white/30 text-sm font-mono leading-relaxed pointer-events-none">
                {code.split("\n").map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Results */}
          {showResults && (
            <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-medium">Test Results</span>
                  {!isRunning && (
                    <span
                      className={`text-sm px-2 py-1 rounded-lg ${
                        passedTests === totalTests
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {passedTests}/{totalTests} passed
                    </span>
                  )}
                </div>
              </div>

              <div
                className="p-4 space-y-3 overflow-y-auto"
                style={{ maxHeight: "200px" }}
              >
                {isRunning ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-white/70">Running test cases...</p>
                  </div>
                ) : (
                  testResults.map((result, index) => (
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
                            result.passed ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          Test Case {index + 1}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="text-white/70">Input:</span>
                          <span className="text-white/90 ml-2 font-mono">
                            {result.input}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/70">Expected:</span>
                          <span className="text-emerald-400 ml-2 font-mono">
                            {result.expected}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/70">Output:</span>
                          <span
                            className={`ml-2 font-mono ${
                              result.passed
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {result.actual}
                          </span>
                        </div>
                        {result.error && (
                          <div>
                            <span className="text-red-400">Error:</span>
                            <span className="text-red-300 ml-2 font-mono">
                              {result.error}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
