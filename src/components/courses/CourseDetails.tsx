import { deleteCourse, getCourseById } from "@/services/course";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import {
  BookOpen,
  Brain,
  Code,
  Play,
  Target,
  FileText,
  ArrowLeft,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { enrollUserInCourse } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { FeedbackDialog } from "./FeedbackDialog";
import { getDifficultyColor } from "@/utils/getDifficultyColor";
import { COURSE_ACTIONS } from "./constants";

const CourseDetails = () => {
  const { courseId = "" } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: course } = useSuspenseQuery({
    queryKey: courseKeys.getById(courseId),
    queryFn: async () => {
      return getCourseById(axiosInstance, { id: courseId });
    },
    select: (data) => data.course,
  });

  const { mutate: deleteCourseMutation } = useMutation({
    mutationKey: courseKeys.delete(courseId),
    mutationFn: async () => {
      return deleteCourse(axiosInstance, { id: courseId });
    },
    onSuccess: () => {
      navigate(routes.COURSES);
    },
    meta: {
      notify: true,
      successMessage: "Course deleted successfully",
      invalidatesQueries: courseKeys.all(),
    },
  });

  const { mutate: enrollCourseMutation } = useMutation({
    mutationKey: userKeys.enrollCourse(),
    mutationFn: async () => {
      return enrollUserInCourse(axiosInstance, {
        courseId,
        enroll: !course.enrolled,
      });
    },
    meta: {
      notify: true,
      successMessage: `${course.enrolled ? "Unenrolled" : "Enrolled"} in course successfully!`,
      invalidatesQueries: [courseKeys.all()],
    },
  });

  const handleAction = (url?: string) => {
    if (url) {
      navigate(url);
    } else {
      deleteCourseMutation();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate(routes.COURSES)}
            className="mb-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <Button
            onClick={() => enrollCourseMutation()}
            className={`mb-4 ${course.enrolled ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"} text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold`}
          >
            {course.enrolled ? "Unenroll" : "Enroll"}
          </Button>
        </div>

        {/* Action Buttons */}
        {user?.role === "ADMIN" && (
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
              <Settings className="h-5 w-5 text-blue-400" />
              Course Management
            </h2>
            <div className="flex flex-wrap gap-3">
              {COURSE_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  onClick={() =>
                    handleAction(action.url ? action.url(courseId) : undefined)
                  }
                  className={`bg-${action.color}-500 hover:bg-${action.color}-600 text-white px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold`}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">
                {course.name}
              </h1>
              <p className="text-white/80 text-lg mb-4">{course.description}</p>

              {/* Difficulty Badge */}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-lg border font-semibold text-sm ${getDifficultyColor(course.difficulty)}`}
              >
                {course.difficulty}
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/20">
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
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <BookOpen className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {course.lessonsCount}
              </div>
              <div className="text-white/70 text-sm">Lessons</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Brain className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {course.quizzesCount}
              </div>
              <div className="text-white/70 text-sm">Quizzes</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Code className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {course.codeAssessmentsCount}
              </div>
              <div className="text-white/70 text-sm">Assessments</div>
            </div>
          </div>
          {!course?.feedbackSubmitted && (
            <div className="mt-6">
              <FeedbackDialog courseId={courseId} />
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lessons Section */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Lessons
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {course.lessonsCount === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">No lessons available</p>
                <p className="text-white/40 text-sm">
                  Add your first lesson to get started
                </p>
              </div>
            ) : (
              course.lessons?.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  to={routes.LESSON_DETAILS(courseId, lesson.id)}
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

        {/* Quizzes Section */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
            <Brain className="h-5 w-5 text-purple-400" />
            Quizzes
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {course.quizzesCount === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">No quizzes available</p>
                <p className="text-white/40 text-sm">
                  Add quizzes to test knowledge
                </p>
              </div>
            ) : (
              course.quizzes?.map((quiz, index) => (
                <Link
                  key={quiz.id}
                  to={routes.QUIZ_DETAILS(courseId, quiz.id)}
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

        {/* Code Assessments Section */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
            <Code className="h-5 w-5 text-emerald-400" />
            Code Assessments
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {course.codeAssessmentsCount === 0 ? (
              <div className="text-center py-8">
                <Code className="h-12 w-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">No assessments available</p>
                <p className="text-white/40 text-sm">Add coding challenges</p>
              </div>
            ) : (
              course.codeAssessments?.map((assessment, index) => (
                <Link
                  key={assessment.id}
                  to={routes.CODE_ASSESSMENT_DETAILS(courseId, assessment.id)}
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
      </div>
    </div>
  );
};

export default CourseDetails;
