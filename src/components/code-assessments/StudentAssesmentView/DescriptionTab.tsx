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
    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl h-screen overflow-y-scroll">
      <div className="space-y-6 h-fit">
        <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
          <h2 className="text-2xl font-bold text-white">
            {codeAssessment.title}
          </h2>

          <Link
            to={routes.COURSE_SUBMISSIONS_CODE_ASSESSMENTS(
              codeAssessment.courseId || "",
            )}
          >
            <span className="ml-4 text-sm text-blue-400 underline underline-offset-4">
              View Submissions
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/80">
          <span>
            Difficulty:{" "}
            <span
              className={`${getDifficultyColor(codeAssessment.difficulty)} px-2 py-1 rounded-lg`}
            >
              {codeAssessment.difficulty}
            </span>
          </span>
          <span>
            Language: <span className="text-blue-400">{language?.label}</span>
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Problem Description
          </h3>

          <p className="text-white/90 leading-relaxed">
            {codeAssessment.description}
          </p>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Instructions
          </h3>
          <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
            {codeAssessment.instructions}
          </p>
        </div>

        {/* Example Test Cases - Fixed colors */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Examples</h3>
          <div className="space-y-4">
            {testCases?.slice(0, 2).map((testCase, index) => (
              <TestCaseItem
                key={testCase.id}
                testCase={testCase}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* TODO: Constraints - Fixed colors */}
        {/* <div> */}
        {/*   <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3> */}
        {/*   <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30"> */}
        {/*     <ul className="text-yellow-100 text-sm space-y-2 text-left"> */}
        {/*       <li>• Time limit: 2 seconds</li> */}
        {/*       <li>• Memory limit: 256 MB</li> */}
        {/*       <li>• Use only standard library functions</li> */}
        {/*     </ul> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default DescriptionTab;
