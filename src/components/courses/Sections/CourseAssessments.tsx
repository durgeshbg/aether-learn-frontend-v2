import type { CodeAssesment } from "@/types/CodeAssesment";
import { Code, FileText } from "lucide-react";
import { Link } from "react-router";

interface CourseLessonsProps {
  codeAssessmentsCount: number;
  codeAssessments?: CodeAssesment[];
  routeTo: (assessmentId: string) => string;
}

const CourseAssesments = ({
  codeAssessmentsCount,
  codeAssessments,
  routeTo,
}: CourseLessonsProps) => {
  return (
    <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
        <Code className="h-5 w-5 text-emerald-400" />
        Code Assessments
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {codeAssessmentsCount === 0 ? (
          <div className="text-center py-8">
            <Code className="h-12 w-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No assessments available</p>
            <p className="text-white/40 text-sm">Add coding challenges</p>
          </div>
        ) : (
          codeAssessments?.map((assessment, index) => (
            <Link
              key={assessment.id}
              to={routeTo(assessment.id)}
              className="block p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold text-sm">
                  C{index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-emerald-300 transition-colors">
                    {assessment.title}
                  </div>
                  <div className="text-white/60 text-xs">
                    Code Challenge • Click to view details
                  </div>
                </div>
                <FileText className="h-4 w-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default CourseAssesments;
