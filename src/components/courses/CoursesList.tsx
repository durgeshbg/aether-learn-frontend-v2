import { useAuth } from "@/hooks/useAuth";
import { getCourses } from "@/services/course";
import { routes } from "@/static-data/routes";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import type { Course } from "@/types/Course";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  BookOpen,
  Clock,
  Target,
  Code,
  Play,
  CheckCircle,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { enrollUserInCourse } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";

// Dummy data for enhanced features (replace with real data from your backend)
const getEnhancedCourseData = (course: Course) => ({
  ...course,
  thumbnail: `/course-thumbnails/${course.id}.jpg`, // Replace with actual thumbnail URL
  progress: Math.floor(Math.random() * 100), // Replace with real progress from backend
  totalLessons: Math.floor(Math.random() * 20) + 5,
  completedLessons: Math.floor(Math.random() * 15) + 1,
  duration: `${Math.floor(Math.random() * 20) + 5}h ${Math.floor(Math.random() * 60)}m`,
  quizzes: Math.floor(Math.random() * 10) + 1,
  assessments: Math.floor(Math.random() * 8) + 1,
  lastModule: `Module ${Math.floor(Math.random() * 8) + 1}`,
  difficulty: ["Beginner", "Intermediate", "Advanced"][
    Math.floor(Math.random() * 3)
  ],
  rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0 rating
  enrolledCount: Math.floor(Math.random() * 1000) + 100,
  isNew: Math.random() > 0.7, // 30% chance of being marked as new
});

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "text-green-400 bg-green-400/20";
    case "Intermediate":
      return "text-yellow-400 bg-yellow-400/20";
    case "Advanced":
      return "text-red-400 bg-red-400/20";
    default:
      return "text-white/60 bg-white/10";
  }
};

const CoursesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: courses } = useSuspenseQuery({
    queryKey: courseKeys.all(),
    queryFn: async () => {
      return getCourses(axiosInstance, {
        organizationId: user?.organization?.id,
      });
    },
    select: (data: { courses: Course[] }) => data.courses,
  });

  const { mutate: enrollCourseMutation } = useMutation({
    mutationKey: userKeys.enrollCourse(),
    mutationFn: async (courseId: string) => {
      return enrollUserInCourse(axiosInstance, { courseId, enroll: true });
    },
    meta: {
      notify: true,
      successMessage: "Enrolled in course successfully!",
      invalidatesQueries: [courseKeys.all()],
    },
  });

  const enhancedCourses = courses.map(getEnhancedCourseData);

  const handleCourseClick = (courseId: string) => {
    if (courses.find((c) => c.id === courseId)?.enrolled) {
      navigate(routes.COURSE_DETAILS(courseId));
    } else {
      enrollCourseMutation(courseId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Available Courses
        </h2>
        <p className="text-white/70">
          Discover and continue your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancedCourses.map((course) => (
          <div
            key={course.id}
            className="group rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl hover:bg-white/15 hover:border-white/25 hover:scale-[1.02] transition-all duration-300"
          >
            {/* Course Thumbnail/Icon */}
            <div className="relative mb-4">
              <div className="w-full h-40 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                <BookOpen className="h-12 w-12 text-white/60" />
              </div>

              {/* New Badge */}
              {course.isNew && (
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
                <span className="text-white/80 text-sm font-medium">
                  Progress
                </span>
                <span className="text-emerald-400 font-bold text-sm">
                  {course.progress}% Complete
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <BookOpen className="h-3 w-3" />
                <span>{course.totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <Clock className="h-3 w-3" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <Target className="h-3 w-3" />
                <span>{course.quizzes} quizzes</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <Code className="h-3 w-3" />
                <span>{course.assessments} assessments</span>
              </div>
            </div>

            {/* Rating and Enrollment */}
            <div className="flex items-center justify-between mb-4 text-xs">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-white/70">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-white/70">
                <Users className="h-3 w-3" />
                <span>{course.enrolledCount} enrolled</span>
              </div>
            </div>

            {/* Last Progress Info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-xs">
                Last: {course.lastModule}
              </span>
              {course.progress > 0 && (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              )}
            </div>

            {/* Action Button */}
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
              onClick={() => handleCourseClick(course.id)}
            >
              <Play className="h-4 w-4 mr-2" />
              {course.enrolled ? "Continue Learning" : "Start Course"}
            </Button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {enhancedCourses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/80 mb-2">
            No Courses Available
          </h3>
          <p className="text-white/60">
            Check back later for new courses or contact your administrator.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
