import type { Quiz } from "@/types/Quiz";
import { Brain, Target } from "lucide-react";
import { Link } from "react-router";

interface CourseQuizzesProps {
  quizzesCount: number;
  quizzes?: Quiz[];
  routeTo: (quizId: string) => string;
}

const CourseQuizzes = ({
  quizzesCount,
  quizzes,
  routeTo,
}: CourseQuizzesProps) => {
  return (
    <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
        <Brain className="h-5 w-5 text-purple-400" />
        Quizzes
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {quizzesCount === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No quizzes available</p>
            <p className="text-white/40 text-sm">
              Add quizzes to test knowledge
            </p>
          </div>
        ) : (
          quizzes?.map((quiz, index) => (
            <Link
              key={quiz.id}
              to={routeTo(quiz.id)}
              className="block p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm">
                  Q{index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                    {quiz.title}
                  </div>
                  <div className="text-white/60 text-xs">
                    Quiz • Click to view details
                  </div>
                </div>
                <Target className="h-4 w-4 text-white/40 group-hover:text-purple-400 transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default CourseQuizzes;
