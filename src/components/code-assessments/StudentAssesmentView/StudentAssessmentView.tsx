import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../ui/button";
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
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleBackLinkClick}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={resetCode}
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-400/30 px-3 py-2 rounded-lg transition-all duration-300"
        >
          <RotateCcw className="h-3 w-3 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <DescriptionTab
          codeAssessment={codeAssessment}
          testCases={testCases}
          language={language}
        />

        <div className="space-y-4">
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
