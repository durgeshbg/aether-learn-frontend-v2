import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { deleteTestCase } from "@/services/test-case";
import { testCaseKeys } from "@/tanstack/keys/test-case";
import { axiosInstance } from "@/utils/axiosInstance";
import { routes } from "@/static-data/routes";
import { Button } from "../ui/button";
import { LANGUAGES_MAP } from "@/static-data/languages";
import type { TestCase } from "@/types/TestCase";
import type { CodeAssesment } from "@/types/CodeAssesment";
import {
  Code2,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  FileText,
  Clock,
  Users,
  Settings,
  Terminal,
  Bug,
  Globe,
} from "lucide-react";
import { deleteCodeAssessment } from "@/services/code-assesment";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";

interface AdminCodeAssessmentViewProps {
  codeAssessment: CodeAssesment;
  testCases: TestCase[];
  courseId: string;
  codeAssessmentId: string;
}

export const AdminCodeAssessmentView = ({
  codeAssessment,
  testCases,
  courseId,
  codeAssessmentId,
}: AdminCodeAssessmentViewProps) => {
  const navigate = useNavigate();
  const [deletingTestCaseId, setDeletingTestCaseId] = useState<string | null>(
    null,
  );

  const { mutate: deleteTestCaseMutation } = useMutation({
    mutationKey: testCaseKeys.delete(courseId, codeAssessmentId, "delete"),
    mutationFn: async (testCaseId: string) => {
      setDeletingTestCaseId(testCaseId);
      return deleteTestCase(axiosInstance, {
        courseId,
        codeAssessmentId,
        id: testCaseId,
      });
    },
    onSettled: () => {
      setDeletingTestCaseId(null);
    },
    meta: {
      notify: true,
      successMessage: "Test Case deleted successfully",
      invalidatesQueries: testCaseKeys.all(courseId, codeAssessmentId),
    },
  });

  const { mutate: deleteCodeAssessmentMutation, isPending: isDeleting } =
    useMutation({
      mutationKey: codeAssessmentKeys.delete(courseId, codeAssessmentId),
      mutationFn: async () => {
        return deleteCodeAssessment(axiosInstance, {
          courseId,
          id: codeAssessmentId,
        });
      },
      onSuccess: () => {
        navigate(routes.COURSE_DETAILS(courseId));
      },
      meta: {
        notify: true,
        successMessage: "Code Assessment deleted successfully",
        invalidatesQueries: codeAssessmentKeys.all(courseId),
      },
    });

  const language = LANGUAGES_MAP[codeAssessment.languageId];

  const handleEditCodeAssessment = () => {
    navigate(routes.CODE_ASSESSMENT_EDIT(courseId, codeAssessmentId));
  };

  // Calculate assessment statistics
  const assessmentStats = {
    totalTestCases: testCases.length,
    estimatedTime: Math.max(30, testCases.length * 5), // 5 minutes per test case, minimum 30
    difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
    successRate: Math.floor(Math.random() * 40) + 50, // Mock data - replace with real
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "Hard":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      default:
        return "text-white/60 bg-white/10 border-white/20";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {/* Assessment Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
                <Code2 className="h-10 w-10 text-white/80" />
              </div>

              {/* Assessment Info */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  {codeAssessment.title}
                </h1>
                <p className="text-white/80 text-lg mb-4">
                  {codeAssessment.description}
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-lg border font-semibold text-sm ${getDifficultyColor(assessmentStats.difficulty)}`}
                  >
                    {assessmentStats.difficulty}
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <span>{language?.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>~{assessmentStats.estimatedTime} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleEditCodeAssessment}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Assessment
              </Button>

              <Button
                onClick={() => deleteCodeAssessmentMutation()}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Assessment
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Bug className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {assessmentStats.totalTestCases}
              </div>
              <div className="text-white/70 text-sm">Test Cases</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {assessmentStats.estimatedTime}m
              </div>
              <div className="text-white/70 text-sm">Est. Time</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Terminal className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {language?.label}
              </div>
              <div className="text-white/70 text-sm">Language</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Users className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {assessmentStats.successRate}%
              </div>
              <div className="text-white/70 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Details and Test Cases Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Instructions and Starter Code */}
        <section className="space-y-6">
          {/* Instructions */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4 text-white">
              <FileText className="h-6 w-6 text-blue-400" />
              Instructions
            </h2>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                {codeAssessment.instructions}
              </p>
            </div>
          </div>

          {/* Starter Code */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4 text-white">
              <Code2 className="h-6 w-6 text-emerald-400" />
              Starter Code
            </h2>
            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm">
                  <Globe className="h-3 w-3" />
                  {language?.label}
                </div>
              </div>
              <pre className="p-6 rounded-xl bg-gray-900/50 border border-white/10 text-white/90 text-sm overflow-x-auto leading-relaxed">
                <code>{codeAssessment.starterCode}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Test Cases Management */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <Settings className="h-6 w-6 text-purple-400" />
              Test Cases ({testCases.length})
            </h2>
            <Button
              onClick={() =>
                navigate(routes.TEST_CASE_CREATE(courseId, codeAssessmentId))
              }
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-lg text-sm transition-all duration-300"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testCases.length === 0 ? (
              <div className="text-center py-12">
                <Bug className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/60 mb-2">
                  No Test Cases Yet
                </h3>
                <p className="text-white/40 text-sm mb-4">
                  Add test cases to validate student solutions
                </p>
                <Button
                  onClick={() =>
                    navigate(
                      routes.TEST_CASE_CREATE(courseId, codeAssessmentId),
                    )
                  }
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Test Case
                </Button>
              </div>
            ) : (
              testCases.map((testCase, index) => (
                <div
                  key={testCase.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold text-xs">
                        {index + 1}
                      </div>
                      <h3 className="font-medium text-white">
                        {testCase.description}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          navigate(
                            routes.TEST_CASE_EDIT(
                              courseId,
                              codeAssessmentId,
                              testCase.id,
                            ),
                          )
                        }
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30 p-1 rounded-lg transition-all duration-300"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => deleteTestCaseMutation(testCase.id)}
                        disabled={deletingTestCaseId === testCase.id}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 p-1 rounded-lg transition-all duration-300 disabled:opacity-50"
                      >
                        {deletingTestCaseId === testCase.id ? (
                          <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-white/70 text-xs">Input:</span>
                      <pre className="text-white/90 mt-1 font-mono">
                        {testCase.input}
                      </pre>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-white/70 text-xs">
                        Expected Output:
                      </span>
                      <pre className="text-white/90 mt-1 font-mono">
                        {testCase.expected}
                      </pre>
                    </div>
                  </div>

                  <div className="text-xs text-white/50 mt-3">
                    Created: {new Date(testCase.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Assessment Metadata */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Assessment Metadata
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-white/70">Created:</span>
            <div className="text-white font-medium">
              {new Date(codeAssessment.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-white/70">Last Updated:</span>
            <div className="text-white font-medium">
              {new Date(codeAssessment.updatedAt).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-white/70">Programming Language:</span>
            <div className="text-white font-medium">{language?.label}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
