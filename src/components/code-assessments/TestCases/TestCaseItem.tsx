import { Button } from "@/components/ui/button";
import { routes } from "@/static-data/routes";
import type { TestCase } from "@/types/TestCase";
import { Edit3, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card key={testCase.id} className="border-border/70">
      <CardHeader className="flex items-center justify-between gap-2 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
            {index + 1}
          </span>
          <CardTitle className="text-sm font-semibold">
            {testCase.description}
          </CardTitle>
        </div>
        {deleteTestCaseMutation && (
          <div className="flex gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() =>
                navigate(
                  routes.TEST_CASE_EDIT(
                    courseId,
                    codeAssessmentId,
                    testCase.id,
                  ),
                )
              }
            >
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-7 w-7"
              onClick={() => deleteTestCaseMutation(testCase.id)}
              disabled={deletingTestCaseId === testCase.id}
            >
              {deletingTestCaseId === testCase.id ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2 p-4 text-xs">
        <div className="rounded-md border border-border/60 p-2">
          <p className="text-[10px] uppercase text-muted-foreground">Input</p>
          <pre className="mt-1 whitespace-pre-wrap font-mono text-muted-foreground">
            {testCase.input}
          </pre>
        </div>
        <div className="rounded-md border border-border/60 p-2">
          <p className="text-[10px] uppercase text-muted-foreground">
            Expected
          </p>
          <pre className="mt-1 whitespace-pre-wrap font-mono text-muted-foreground">
            {testCase.expected}
          </pre>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Created {new Date(testCase.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default TestCaseItem;
