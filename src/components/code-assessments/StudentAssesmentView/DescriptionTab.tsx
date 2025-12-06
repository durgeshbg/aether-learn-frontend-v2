import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CodeAssesment } from "@/types/CodeAssesment";
import type { TestCase } from "@/types/TestCase";
import TestCaseItem from "../TestCases/TestCaseItem";
import { getDifficultyColor } from "@/utils/getDifficultyColor";
import type { Language } from "@/static-data/languages";
import { Link } from "react-router";
import { routes } from "@/static-data/routes";

interface DescriptionTabProps {
  codeAssessment: CodeAssesment;
  testCases?: TestCase[];
  language?: Language;
}

const DescriptionTab = ({
  codeAssessment,
  testCases,
  language,
}: DescriptionTabProps) => {
  return (
    <Card className="h-full border border-border/70">
      <CardHeader className="space-y-3 border-b">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl">{codeAssessment.title}</CardTitle>
          <CardDescription>{codeAssessment.description}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 font-medium capitalize ${getDifficultyColor(codeAssessment.difficulty)}`}
          >
            {codeAssessment.difficulty}
          </span>
          {language && (
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1">
              {language.label}
            </span>
          )}
          <Link
            to={routes.COURSE_SUBMISSIONS_CODE_ASSESSMENTS(
              codeAssessment.courseId || "",
            )}
            className="text-primary underline-offset-4 hover:underline"
          >
            View submissions
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 overflow-y-auto">
        <section>
          <h3 className="text-sm font-medium text-foreground">
            Problem description
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {codeAssessment.description}
          </p>
        </section>

        <section>
          <h3 className="text-sm font-medium text-foreground">Instructions</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
            {codeAssessment.instructions}
          </p>
        </section>

        <section>
          <h3 className="text-sm font-medium text-foreground">Examples</h3>
          <div className="mt-3 space-y-3">
            {testCases?.slice(0, 2).map((testCase, index) => (
              <TestCaseItem
                key={testCase.id}
                testCase={testCase}
                index={index}
              />
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default DescriptionTab;
