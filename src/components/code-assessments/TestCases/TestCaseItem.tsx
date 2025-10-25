import { Button } from "@/components/ui/button";
import { routes } from "@/static-data/routes";
import type { TestCase } from "@/types/TestCase";
import { Edit3, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const TestCaseItem = ({
  index,
  testCase,
  deleteTestCaseMutation,
  deletingTestCaseId,
}: {
  index: number;
  testCase: TestCase;
  deleteTestCaseMutation?: (id: string) => void;
  deletingTestCaseId?: string | null;
}) => {
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId: string;
  }>();
  const navigate = useNavigate();

  return (
    <div
      key={testCase.id}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold text-xs">
            {index + 1}
          </div>
          <h3 className="font-medium text-white">{testCase.description}</h3>
        </div>
        {deleteTestCaseMutation && (
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
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <span className="text-white/70 text-xs">Input:</span>
          <pre className="text-white/90 mt-1 font-mono">{testCase.input}</pre>
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <span className="text-white/70 text-xs">Expected Output:</span>
          <pre className="text-white/90 mt-1 font-mono">
            {testCase.expected}
          </pre>
        </div>
      </div>

      <div className="text-xs text-white/50 mt-3">
        Created: {new Date(testCase.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TestCaseItem;
