import type { Lesson } from "@/types/Lesson";
import { BookOpen, Play } from "lucide-react";
import { Link } from "react-router";

interface CourseLessonsProps {
  lessons?: Lesson[];
  lessonsCount: number;
  routeTo: (lessonId: string) => string;
}

const CourseLessons = ({
  lessons,
  lessonsCount,
  routeTo,
}: CourseLessonsProps) => {
  return (
    <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
        <BookOpen className="h-5 w-5 text-blue-400" />
        Lessons
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {lessonsCount === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No lessons available</p>
            <p className="text-white/40 text-sm">
              Add your first lesson to get started
            </p>
          </div>
        ) : (
          lessons?.map((lesson, index) => (
            <Link
              key={lesson.id}
              to={routeTo(lesson.id)}
              className="block p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-sm">
                  L{index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-blue-300 transition-colors">
                    {lesson.title}
                  </div>
                  <div className="text-white/60 text-xs">
                    Lesson • Click to view details
                  </div>
                </div>
                <Play className="h-4 w-4 text-white/40 group-hover:text-blue-400 transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default CourseLessons;
