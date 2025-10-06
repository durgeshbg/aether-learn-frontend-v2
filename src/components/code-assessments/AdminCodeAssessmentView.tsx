import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { deleteTestCase } from "@/services/test-case";
import { testCaseKeys } from "@/tanstack/keys/test-case";
import { axiosInstance } from "@/utils/axiosInstance";
import { routes } from "@/static-data/routes";
import { Button } from "../ui/button";
import { LANGUAGES_MAP, LANG_KEYS } from "@/static-data/languages";
import type { CodeAssesment } from "@/types/CodeAssesment";
import {
  Code2,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  FileText,
  Clock,
  Settings,
  Terminal,
  Bug,
  Globe,
} from "lucide-react";
import { deleteCodeAssessment } from "@/services/code-assesment";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { getDifficultyColor } from "@/utils/getDifficultyColor";
import TestCaseItem from "./TestCases/TestCaseItem";
import { adminCodeAssessmentData } from "./constants";

interface AdminCodeAssessmentViewProps {
  codeAssessment: CodeAssesment;
  courseId: string;
}

const {
  backButtonText,
  editButtonText,
  deleteButtonText,
  deleteLoadingText,
  addTestCaseButtonText,
  emptyTestCasesText,
  testCaseAddTip,
  createFirstTestCaseText,
} = adminCodeAssessmentData;

export const AdminCodeAssessmentView = ({
  codeAssessment,
  courseId,
}: AdminCodeAssessmentViewProps) => {
  const navigate = useNavigate();
  const [deletingTestCaseId, setDeletingTestCaseId] = useState<string | null>(
    null,
  );

  const testCases = codeAssessment.testCases || [];

  const { mutate: deleteTestCaseMutation } = useMutation({
    mutationKey: testCaseKeys.delete(courseId, codeAssessment.id, "delete"),
    mutationFn: async (testCaseId: string) => {
      setDeletingTestCaseId(testCaseId);
      return deleteTestCase(axiosInstance, {
        courseId,
        codeAssessmentId: codeAssessment.id,
        id: testCaseId,
      });
    },
    onSettled: () => {
      setDeletingTestCaseId(null);
    },
    meta: {
      notify: true,
      successMessage: "Test Case deleted successfully",
      invalidatesQueries: testCaseKeys.all(courseId, codeAssessment.id),
    },
  });

  const { mutate: deleteCodeAssessmentMutation, isPending: isDeleting } =
    useMutation({
      mutationKey: codeAssessmentKeys.delete(courseId, codeAssessment.id),
      mutationFn: async () => {
        return deleteCodeAssessment(axiosInstance, {
          courseId,
          id: codeAssessment.id,
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
  const languageId =
    parseInt(codeAssessment?.languageId || "") || LANG_KEYS.PLAIN_TEXT;
  const language = LANGUAGES_MAP.get(languageId);

  const handleEditCodeAssessment = () => {
    navigate(routes.CODE_ASSESSMENT_EDIT(courseId, codeAssessment.id));
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
          {backButtonText}
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
                    className={`inline-flex items-center px-3 py-1 rounded-lg border font-semibold text-sm ${getDifficultyColor(codeAssessment.difficulty)}`}
                  >
                    {codeAssessment.difficulty}
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
                {editButtonText}
              </Button>

              <Button
                onClick={() => deleteCodeAssessmentMutation()}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {deleteLoadingText}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteButtonText}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Bug className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {codeAssessment.testCases?.length}
              </div>
              <div className="text-white/70 text-sm">Test Cases</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {codeAssessment.durationMinutes}m
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
              Test Cases ({testCases?.length})
            </h2>
            <Button
              onClick={() =>
                navigate(routes.TEST_CASE_CREATE(courseId, codeAssessment.id))
              }
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-lg text-sm transition-all duration-300"
            >
              <Plus className="h-3 w-3 mr-1" />
              {addTestCaseButtonText}
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testCases?.length === 0 ? (
              <div className="text-center py-12">
                <Bug className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/60 mb-2">
                  {emptyTestCasesText}
                </h3>
                <p className="text-white/40 text-sm mb-4">{testCaseAddTip}</p>
                <Button
                  onClick={() =>
                    navigate(
                      routes.TEST_CASE_CREATE(courseId, codeAssessment.id),
                    )
                  }
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {createFirstTestCaseText}
                </Button>
              </div>
            ) : (
              testCases?.map((testCase, index) => (
                <TestCaseItem
                  key={testCase.id}
                  index={index}
                  testCase={testCase}
                  deleteTestCaseMutation={deleteTestCaseMutation}
                  deletingTestCaseId={deletingTestCaseId}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
