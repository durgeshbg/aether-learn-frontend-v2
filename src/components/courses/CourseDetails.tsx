import { deleteCourse, getCourseById } from "@/services/course";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { BookOpen, Brain, Code, ArrowLeft, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { enrollUserInCourse } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { FeedbackDialog } from "./FeedbackDialog";
import { getDifficultyColor } from "@/utils/getDifficultyColor";
import { COURSE_ACTIONS } from "./constants";
import CourseLessons from "./Sections/CourseLessons";
import CourseQuizzes from "./Sections/CourseQuizzes";
import CourseAssesments from "./Sections/CourseAssessments";

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
        <CourseLessons
          lessons={course.lessons}
          lessonsCount={course.lessonsCount}
          routeTo={(lessonId: string) =>
            routes.LESSON_DETAILS(courseId, lessonId)
          }
        />

        <CourseQuizzes
          quizzes={course.quizzes}
          quizzesCount={course.quizzesCount}
          routeTo={(quizId: string) => routes.QUIZ_DETAILS(courseId, quizId)}
        />

        <CourseAssesments
          codeAssessmentsCount={course.codeAssessmentsCount}
          codeAssessments={course.codeAssessments}
          routeTo={(assessmentId: string) =>
            routes.CODE_ASSESSMENT_DETAILS(courseId, assessmentId)
          }
        />
      </div>
    </div>
  );
};

export default CourseDetails;
