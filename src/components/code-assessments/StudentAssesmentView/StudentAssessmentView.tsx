import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { LANG_KEYS, LANGUAGES_MAP } from "@/static-data/languages";
import type { TestCase } from "@/types/TestCase";
import type { CodeAssesment } from "@/types/CodeAssesment";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { routes } from "@/static-data/routes";
import EditorPanel from "./EditorPanel";
import TestCaseResults from "./TestCaseResults";
import { useMutation, useQuery } from "@tanstack/react-query";
import { codeSolutionKeys } from "@/tanstack/keys/code-solution";
import {
  getCodeSolutionById,
  getCodeSolutionStatus,
  runCodeSolution,
  submitCodeSolution,
} from "@/services/code-solution";
import { axiosInstance } from "@/utils/axiosInstance";
import DescriptionTab from "./DescriptionTab";

interface StudentCodeAssessmentViewProps {
  codeAssessment: CodeAssesment;
  testCases?: TestCase[];
}

export const StudentAssessmentView = ({
  codeAssessment,
  testCases,
}: StudentCodeAssessmentViewProps) => {
  const navigate = useNavigate();

  const [code, setCode] = useState(codeAssessment.starterCode || "");
  const [isRunning, setIsRunning] = useState(false);
  const [codeSolutionId, setCodeSolutionId] = useState<string | null>(null);

  const languageId =
    parseInt(codeAssessment.languageId || "") || LANG_KEYS.PLAIN_TEXT;
  const language = LANGUAGES_MAP.get(languageId);

  const { data: status } = useQuery({
    queryKey: codeSolutionKeys.getStatus(
      codeAssessment.courseId || "",
      codeAssessment.id,
      codeSolutionId || "",
    ),
    enabled: !!codeSolutionId,
    refetchInterval: (query) =>
      query.state.data?.status === "SUBMITTED" ? 2000 : false,
    queryFn: async () => {
      return getCodeSolutionStatus(axiosInstance, {
        courseId: codeAssessment.courseId || "",
        codeAssessmentId: codeAssessment.id,
        id: codeSolutionId || "",
      });
    },
    select: (data) => data.status,
  });

  if (status === "GRADED" && isRunning) {
    setIsRunning(false);
  }

  const { data: testCaseResults, isFetching: isTestCaseResultsFetching } =
    useQuery({
      queryKey: codeSolutionKeys.getById(
        codeAssessment.courseId || "",
        codeAssessment.id,
        codeSolutionId || "",
      ),
      enabled: status === "GRADED",
      queryFn: async () => {
        return getCodeSolutionById(axiosInstance, {
          courseId: codeAssessment.courseId || "",
          codeAssessmentId: codeAssessment.id,
          id: codeSolutionId || "",
        });
      },
      select: (data) => data.codeSolution.testCaseResults,
      meta: {
        notify: false,
        invalidatesQueries: [
          codeSolutionKeys.all(
            codeAssessment.courseId || "",
            codeAssessment.id,
          ),
        ],
      },
    });

  const { mutate: runCodeMutation } = useMutation({
    mutationKey: codeSolutionKeys.run(
      codeAssessment.courseId || "",
      codeAssessment.id,
    ),
    mutationFn: async () => {
      return runCodeSolution(
        axiosInstance,
        {
          courseId: codeAssessment.courseId || "",
          codeAssessmentId: codeAssessment.id,
        },
        {
          code,
        },
      );
    },
    onSuccess: (data) => {
      setCodeSolutionId(data.codeSolutionId);
    },
    meta: {
      notify: false,
      invalidatesQueries: [
        codeSolutionKeys.all(codeAssessment.courseId || "", codeAssessment.id),
      ],
    },
  });

  const { mutate: submitCodeMutation } = useMutation({
    mutationKey: codeSolutionKeys.submit(
      codeAssessment.courseId || "",
      codeAssessment.id,
    ),
    mutationFn: async () => {
      return submitCodeSolution(
        axiosInstance,
        {
          courseId: codeAssessment.courseId || "",
          codeAssessmentId: codeAssessment.id,
        },
        {
          code,
        },
      );
    },
    onSuccess: (data) => {
      setCodeSolutionId(data.codeSolutionId);
    },
    meta: {
      notify: false,
      invalidatesQueries: [
        codeSolutionKeys.all(codeAssessment.courseId || "", codeAssessment.id),
      ],
    },
  });

  const runCode = () => {
    setIsRunning(true);
    runCodeMutation();
  };

  const submitCode = async () => {
    setIsRunning(true);
    submitCodeMutation();
  };

  const resetCode = () => {
    setCode(codeAssessment.starterCode || "");
  };

  const handleBackLinkClick = useCallback(() => {
    navigate(routes.COURSE_DETAILS(codeAssessment?.courseId || ""));
  }, [navigate, codeAssessment]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackLinkClick}
          className="inline-flex items-center gap-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={resetCode}
          className="inline-flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset code
        </Button>
      </div>

      <Card className="border border-border/70">
        <CardHeader>
          <CardTitle className="text-2xl">{codeAssessment.title}</CardTitle>
          <CardDescription>
            Review the prompt on the left, implement your solution on the right,
            and run tests before submitting.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
        <DescriptionTab
          codeAssessment={codeAssessment}
          testCases={testCases}
          language={language}
        />

        <div className="flex flex-col gap-4">
          <EditorPanel
            code={code}
            setCode={setCode}
            language={language}
            isRunning={isRunning}
            runCode={runCode}
            submitCode={submitCode}
            assesmentId={codeAssessment.id}
          />

          <TestCaseResults
            testResults={testCaseResults}
            isRunning={isTestCaseResultsFetching || isRunning}
          />
        </div>
      </div>
    </div>
  );
};
