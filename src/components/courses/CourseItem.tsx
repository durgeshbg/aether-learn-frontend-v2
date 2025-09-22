import { BookOpen, Code, Play, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types/Course";
import { getDifficultyColor } from "@/utils/getDifficultyColor";
import type { CourseProgress } from "@/types/User";

interface ICourseItem {
  course: Course;
  courseProgress?: CourseProgress;
  onCourseClick: (courseId: string) => void;
}

const CourseItem = ({ course, courseProgress, onCourseClick }: ICourseItem) => {
  // Is course created within the last 30 days
  const isCourseNew =
    new Date(course.createdAt) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && !course.enrolled;

  return (
    <div
      key={course.id}
      className="group rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl hover:bg-white/15 hover:border-white/25 hover:scale-[1.02] transition-all duration-300"
    >
      {/* Course Thumbnail/Icon */}
      <div className="relative mb-4">
        <div className="w-full h-40 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.name}
              className="w-full h-full object-cover rounded-xl opacity-40"
            />
          ) : (
            <BookOpen className="h-12 w-12 text-white/60" />
          )}
        </div>

        {/* New Badge */}
        {isCourseNew && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            NEW
          </div>
        )}

        {/* Difficulty Badge */}
        <div
          className={`absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(course.difficulty)}`}
        >
          {course.difficulty}
        </div>
      </div>
      {/* Course Title */}
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
        {course.name}
      </h3>
      {/* Course Description */}
      <p className="text-white/70 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm font-medium">Progress</span>
          <span className="text-emerald-400 font-bold text-sm">
            {courseProgress?.completionRate || 0}% Complete
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${courseProgress?.completionRate || 0}%` }}
          ></div>
        </div>
      </div>
      {/* Course Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <BookOpen className="h-3 w-3" />
          <span>{course.lessonsCount} lessons</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <Target className="h-3 w-3" />
          <span>{course.quizzesCount} quizzes</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <Code className="h-3 w-3" />
          <span>{course.codeAssessmentsCount} assessments</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div> Rating</div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-white/70">{course.rating}</span>
        </div>
      </div>
      {/* Last Progress Info */}
      <div className="max-w-fit mb-4 min-h-[24px] text-white/70 text-xs bg-white/10 backdrop-blur-2xl border border-white/15 rounded-full px-3 py-1">
        {courseProgress?.nextModuleId ? (
          <>
            Next:{" "}
            <span className="font-semibold">
              {courseProgress.nextModule?.title}
            </span>
          </>
        ) : (
          "Not Started"
        )}
      </div>
      {/* Action Button */}
      <Button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
        onClick={() => onCourseClick(course.id)}
      >
        <Play className="h-4 w-4 mr-2" />
        {course.enrolled ? "Continue Learning" : "Start Course"}
      </Button>
    </div>
  );
};

export default CourseItem;
