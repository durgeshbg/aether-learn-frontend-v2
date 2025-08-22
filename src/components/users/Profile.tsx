import Loading from "@/containers/loading/loading";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Building2,
  Edit3,
  Camera,
  Award,
  Calendar,
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { User } from "@/types/User";

// Enhanced user data for student profile
const enhanceUserProfile = (user: User) => ({
  ...user,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
  college: user.organization?.name || "Your College",
  branch: "Computer Science Engineering", // Make dynamic later
  year: 3,
  semester: 6,
  gpa: "8.5",
  joinedDate: new Date(user.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  ),
  completedCourses: 12,
  totalCourses: 16,
  skillsLearned: 15,
  certificatesEarned: 4,
  currentStreak: 7,
  achievements: ["Quick Learner", "Problem Solver", "Consistent Performer"],
  recentActivity: [
    {
      type: "assignment",
      title: "Data Structures Assignment",
      date: "2 days ago",
      score: 95,
    },
    {
      type: "quiz",
      title: "JavaScript Fundamentals",
      date: "4 days ago",
      score: 88,
    },
    {
      type: "project",
      title: "React Dashboard",
      date: "1 week ago",
      score: 92,
    },
  ],
});

const Profile = () => {
  const { user: rawUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!rawUser) {
    return <Loading />;
  }

  const user = enhanceUserProfile(rawUser);
  const courseProgress = Math.round(
    (user.completedCourses / user.totalCourses) * 100,
  );

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information and track your progress
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-primary/90 hover:bg-primary backdrop-blur-sm shadow-lg shadow-primary/25"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 overflow-hidden sticky top-6">
              {/* Profile Header */}
              <div className="relative p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="relative text-center">
                  <div className="relative mx-auto w-32 h-32 mb-4 group">
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full bg-muted border-4 border-background shadow-xl"
                    />
                    {isEditing && (
                      <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-8 w-8 text-white" />
                      </button>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-muted-foreground mb-4">{user.email}</p>

                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {user.role}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.gpa}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Current GPA
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                    <div className="text-2xl font-bold text-green-600">
                      {user.currentStreak}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Day Streak
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{user.college}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{user.branch}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">
                      Year {user.year}, Semester {user.semester}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={user.firstName}
                        className="mt-1 w-full px-3 py-2 bg-background/50 border border-border/40 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/40 backdrop-blur-sm"
                      />
                    ) : (
                      <p className="mt-1 text-foreground font-medium">
                        {user.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={user.lastName}
                        className="mt-1 w-full px-3 py-2 bg-background/50 border border-border/40 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/40 backdrop-blur-sm"
                      />
                    ) : (
                      <p className="mt-1 text-foreground font-medium">
                        {user.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground font-medium">
                        {user.email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Student ID
                    </label>
                    <p className="mt-1 text-foreground font-medium font-mono text-sm bg-muted/20 px-3 py-2 rounded-lg">
                      #{user.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Progress */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Academic Progress
              </h3>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                  <Trophy className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-600">
                    {courseProgress}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Course Progress
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                  <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-orange-600">
                    {user.skillsLearned}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Skills Learned
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                  <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-emerald-600">
                    {user.certificatesEarned}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Certificates
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
                  <BookOpen className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-pink-600">
                    {user.completedCourses}/{user.totalCourses}
                  </div>
                  <div className="text-xs text-muted-foreground">Courses</div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="font-semibold mb-3">Recent Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  {user.achievements.map(
                    (achievement: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 flex items-center gap-1"
                      >
                        <Award className="h-3 w-3" />
                        {achievement}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Activity
              </h3>

              <div className="space-y-4">
                {user.recentActivity.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          activity.type === "assignment"
                            ? "bg-blue-500/20 text-blue-600"
                            : activity.type === "quiz"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-purple-500/20 text-purple-600"
                        }`}
                      >
                        {activity.type === "assignment" ? (
                          <BookOpen className="h-4 w-4" />
                        ) : activity.type === "quiz" ? (
                          <Target className="h-4 w-4" />
                        ) : (
                          <Trophy className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {activity.score}%
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
