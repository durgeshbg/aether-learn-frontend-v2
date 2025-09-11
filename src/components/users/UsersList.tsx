import { getUsers } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import type { User } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { routes } from "@/static-data/routes";
import {
  GraduationCap,
  Mail,
  MapPin,
  Calendar,
  Award,
  Users,
  Search,
  Filter,
} from "lucide-react";

// Dummy data for enhanced display
const enhanceUserData = (user: User) => ({
  ...user,
  college: user.organization || "MIT College of Engineering",
  year: Math.floor(Math.random() * 4) + 1,
  branch: ["Computer Science", "Electronics", "Mechanical", "Civil"][
    Math.floor(Math.random() * 4)
  ],
  gpa: (3.2 + Math.random() * 0.8).toFixed(2),
  joinedDate: new Date(
    2020 + Math.floor(Math.random() * 4),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28),
  ).toLocaleDateString(),
  status: ["Active", "Inactive", "Pending"][Math.floor(Math.random() * 3)],
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
});

const UsersList = () => {
  const navigate = useNavigate();
  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.all(),
    queryFn: async () => {
      return getUsers(axiosInstance);
    },
    select: (data) => data.users?.map(enhanceUserData) || [],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "Inactive":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getYearSuffix = (year: number) => {
    if (year === 1) return "st";
    if (year === 2) return "nd";
    if (year === 3) return "rd";
    return "th";
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Students Directory
            </h2>
            <p className="text-sm text-muted-foreground">
              {users?.length || 0} students across organizations
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-card/40 backdrop-blur-sm border-border/40"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-card/40 backdrop-blur-sm border-border/40"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <div
            key={user.id}
            className="group relative overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 hover:border-border/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            onClick={() => navigate(routes.USER_DETAILS(user.id))}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative p-6 space-y-4">
              {/* Header with avatar and status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full bg-muted border-2 border-border/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}
                >
                  {user.status}
                </span>
              </div>

              {/* Academic Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">
                    {user.branch}
                  </span>
                  <span className="text-muted-foreground">
                    • {user.year}
                    {getYearSuffix(user.year)} Year
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.organization?.name}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {user.joinedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                      GPA: {user.gpa}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Badge */}
              <div className="pt-3 border-t border-border/20">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {user.role || "Student"}
                </span>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {(!users || users.length === 0) && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No students found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first student.
          </p>
          <Button onClick={() => navigate(routes.USER_CREATE)}>
            <GraduationCap className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersList;
