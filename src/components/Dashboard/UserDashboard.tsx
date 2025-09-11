import {
  BookOpen,
  Play,
  Clock,
  Award,
  TrendingUp,
  Target,
  FileText,
  Code,
  Brain,
} from "lucide-react";
import { Button } from "../ui/button";

const userStats = {
  totalCourses: 5,
  completedCourses: 2,
  overallProgress: 68,
  totalLessons: 45,
  completedLessons: 31,
  averageScore: 87,
  streakDays: 12,
  timeSpent: "24.5h",
};

const enrolledCourses = [
  {
    id: 1,
    name: "React Fundamentals",
    progress: 85,
    totalLessons: 12,
    completedLessons: 10,
    lastAccessed: "2 hours ago",
    nextLesson: "React Hooks Deep Dive",
  },
  {
    id: 2,
    name: "JavaScript Advanced",
    progress: 92,
    totalLessons: 8,
    completedLessons: 7,
    lastAccessed: "1 day ago",
    nextLesson: "Async/Await Patterns",
  },
  {
    id: 3,
    name: "Node.js Backend",
    progress: 45,
    totalLessons: 15,
    completedLessons: 7,
    lastAccessed: "3 days ago",
    nextLesson: "Express.js Middleware",
  },
  {
    id: 4,
    name: "Python Data Science",
    progress: 23,
    totalLessons: 20,
    completedLessons: 5,
    lastAccessed: "5 days ago",
    nextLesson: "Pandas DataFrames",
  },
  {
    id: 5,
    name: "Database Design",
    progress: 67,
    totalLessons: 10,
    completedLessons: 7,
    lastAccessed: "1 week ago",
    nextLesson: "SQL Optimization",
  },
];

const recentActivity = [
  {
    type: "lesson",
    title: "React State Management",
    course: "React Fundamentals",
    completedAt: "2 hours ago",
    score: 95,
  },
  {
    type: "quiz",
    title: "JavaScript ES6 Quiz",
    course: "JavaScript Advanced",
    completedAt: "1 day ago",
    score: 88,
  },
  {
    type: "code",
    title: "Todo App Challenge",
    course: "React Fundamentals",
    completedAt: "2 days ago",
    score: 92,
  },
  {
    type: "lesson",
    title: "Node.js Modules",
    course: "Node.js Backend",
    completedAt: "3 days ago",
    score: 85,
  },
];

const upcomingDeadlines = [
  {
    type: "quiz",
    title: "React Hooks Quiz",
    course: "React Fundamentals",
    dueDate: "Tomorrow",
    priority: "high",
  },
  {
    type: "assessment",
    title: "JavaScript Final Project",
    course: "JavaScript Advanced",
    dueDate: "3 days",
    priority: "medium",
  },
  {
    type: "quiz",
    title: "Database Normalization Quiz",
    course: "Database Design",
    dueDate: "1 week",
    priority: "low",
  },
  {
    type: "assessment",
    title: "Python Data Analysis Project",
    course: "Python Data Science",
    dueDate: "2 weeks",
    priority: "low",
  },
];

type ActivityType = "lesson" | "quiz" | "code" | "assessment";

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "lesson":
      return <BookOpen className="h-4 w-4" />;
    case "quiz":
      return <Brain className="h-4 w-4" />;
    case "code":
      return <Code className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

type PriorityType = "high" | "medium" | "low" | "none";

const getPriorityColor = (priority: PriorityType) => {
  switch (priority) {
    case "high":
      return "text-red-400 border-red-400/20";
    case "medium":
      return "text-yellow-400 border-yellow-400/20";
    case "low":
      return "text-green-400 border-green-400/20";
    default:
      return "text-white/60 border-white/20";
  }
};

function UserDashboard() {
  const handleContinueLearning = (course: {
    id: number;
    name: string;
    nextLesson: string;
  }) => {
    console.log(`Continue learning: ${course.name} - ${course.nextLesson}`);
  };

  const handleViewCourse = (courseId: number) => {
    console.log(`Navigate to course: ${courseId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-3 text-white">
        Your Learning Dashboard
      </h1>
      <p className="text-white/80 mb-8 text-lg">
        Welcome back! Continue your learning journey and track your progress.
      </p>

      {/* Performance Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <span className="text-sm text-white/70">Progress</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {userStats.overallProgress}%
          </div>
          <div className="text-white/80 text-sm">Overall Progress</div>
          <div className="text-blue-400 text-xs mt-1">
            {userStats.completedLessons}/{userStats.totalLessons} lessons
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-8 w-8 text-yellow-400" />
            <span className="text-sm text-white/70">Score</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {userStats.averageScore}%
          </div>
          <div className="text-white/80 text-sm">Average Score</div>
          <div className="text-green-400 text-xs mt-1">+3% this month</div>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Target className="h-8 w-8 text-emerald-400" />
            <span className="text-sm text-white/70">Completed</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {userStats.completedCourses}
          </div>
          <div className="text-white/80 text-sm">Courses Completed</div>
          <div className="text-white/60 text-xs mt-1">
            of {userStats.totalCourses} enrolled
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-8 w-8 text-purple-400" />
            <span className="text-sm text-white/70">Streak</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {userStats.streakDays}
          </div>
          <div className="text-white/80 text-sm">Day Streak</div>
          <div className="text-purple-400 text-xs mt-1">
            {userStats.timeSpent} total time
          </div>
        </div>
      </section>

      {/* Course Progress Overview */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-10">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-white">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Course Progress Overview
        </h2>
        <div className="grid gap-4">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{course.name}</h3>
                  <p className="text-sm text-white/70">
                    {course.completedLessons} of {course.totalLessons} lessons •
                    Last accessed {course.lastAccessed}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-400">
                    {course.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">
                  Next: {course.nextLesson}
                </span>
                <Button
                  onClick={() => handleContinueLearning(course)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Continue
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Continue Learning & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Continue Learning */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
            <Play className="h-5 w-5 text-green-400" />
            Continue Learning
          </h2>
          <div className="space-y-3">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <div className="font-medium text-white">{course.name}</div>
                  <div className="text-sm text-white/70">
                    Next: {course.nextLesson}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleContinueLearning(course)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Resume
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
            <Clock className="h-5 w-5 text-purple-400" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-blue-400">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white text-sm">
                    {activity.title}
                  </div>
                  <div className="text-xs text-white/70">
                    {activity.course} • {activity.completedAt}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-semibold text-sm">
                    {activity.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
