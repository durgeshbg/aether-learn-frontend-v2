import type { CodeAssesment } from "@/types/CodeAssesment";
import { Code, FileText } from "lucide-react";
import { Link } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CourseAssessmentsProps {
  codeAssessmentsCount: number;
  codeAssessments?: CodeAssesment[];
  routeTo: (assessmentId: string) => string;
}

const CourseAssesments = ({
  codeAssessmentsCount,
  codeAssessments,
  routeTo,
}: CourseAssessmentsProps) => {
  return (
    <Card className="h-fit">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            Code assessments ({codeAssessmentsCount})
          </CardTitle>
          <CardDescription>
            Coding challenges assigned to this course.
          </CardDescription>
        </div>
        <span className="rounded-full bg-primary/10 p-2 text-primary">
          <Code className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {codeAssessmentsCount === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
            No assessments yet. Add coding exercises to deepen practice.
          </div>
        ) : (
          <div className="space-y-3">
            {codeAssessments?.map((assessment, index) => (
              <Link
                key={assessment.id}
                to={routeTo(assessment.id)}
                className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  C{index + 1}
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="font-medium text-foreground">
                    {assessment.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Code challenge • Click to view details
                  </span>
                </div>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseAssesments;
