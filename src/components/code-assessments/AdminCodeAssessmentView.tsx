import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { deleteTestCase } from "@/services/test-case";
import { testCaseKeys } from "@/tanstack/keys/test-case";
import { axiosInstance } from "@/utils/axiosInstance";
import { routes } from "@/static-data/routes";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { LANGUAGES_MAP, LANG_KEYS } from "@/static-data/languages";
import type { CodeAssesment } from "@/types/CodeAssesment";
import {
  Code2,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  Loader2Icon,
  Bug,
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
} = adminCodeAssessmentData;

export const AdminCodeAssessmentView = ({
  codeAssessment,
  courseId,
}: AdminCodeAssessmentViewProps) => {
  const navigate = useNavigate();
  const [deletingTestCaseId, setDeletingTestCaseId] = useState<string | null>(
    null
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
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backButtonText}
      </Button>

      <Card>
        <CardHeader className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <CardDescription>Code assessment</CardDescription>
                <CardTitle className="text-3xl">
                  {codeAssessment.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {codeAssessment.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={handleEditCodeAssessment}>
                <Edit3 className="mr-2 h-4 w-4" />
                {editButtonText}
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteCodeAssessmentMutation()}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {deleteLoadingText}
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteButtonText}
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Difficulty",
                value: codeAssessment.difficulty,
                className: getDifficultyColor(codeAssessment.difficulty),
              },
              {
                label: "Duration",
                value: `${codeAssessment.durationMinutes}m`,
              },
              {
                label: "Language",
                value: language?.label || "Not set",
              },
              {
                label: "Test cases",
                value: codeAssessment.testCases?.length || 0,
              },
            ].map(({ label, value, className }) => (
              <div
                key={label}
                className="rounded-lg border border-border/70 px-3 py-2"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p
                  className={
                    className
                      ? `mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${className}`
                      : "text-sm font-semibold text-foreground"
                  }
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Instructions</CardTitle>
              <CardDescription>
                Set the stage for learners before they start coding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/70 bg-card/80 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {codeAssessment.instructions}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Starter code</CardTitle>
              <CardDescription>
                Provide the scaffolding students begin with.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/70 bg-zinc-950/95 p-4 text-sm leading-relaxed text-muted-foreground">
                <pre className="overflow-x-auto">
                  <code>{codeAssessment.starterCode}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Runner code</CardTitle>
              <CardDescription>
                Executed after learners submit their solution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/70 bg-zinc-950/95 p-4 text-sm leading-relaxed text-muted-foreground">
                <pre className="overflow-x-auto">
                  <code>{codeAssessment.runnerCode}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Test cases ({testCases.length})
              </CardTitle>
              <CardDescription>
                Maintain coverage and edge-case validation.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                navigate(routes.TEST_CASE_CREATE(courseId, codeAssessment.id))
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              {addTestCaseButtonText}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-y-scroll max-h-[600px] p-4">
            {testCases.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
                <Bug className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {emptyTestCasesText}
                </p>
              </div>
            ) : (
              testCases.map((testCase, index) => (
                <TestCaseItem
                  key={testCase.id}
                  index={index}
                  testCase={testCase}
                  deleteTestCaseMutation={deleteTestCaseMutation}
                  deletingTestCaseId={deletingTestCaseId}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
