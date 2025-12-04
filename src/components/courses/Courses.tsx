import { Outlet, useNavigate } from "react-router";
import { BookOpen, Library, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/static-data/routes";

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate(routes.COURSE_CREATE);
  };

  const handleViewCourses = () => {
    navigate(routes.COURSES);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <Card className="border border-border/70">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Courses
            </CardTitle>
            <CardDescription className="text-base">
              Manage learning content, assignments, and enrollment activity.
            </CardDescription>
          </div>
          {!isAdmin && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Active courses</p>
              <p className="text-2xl font-semibold text-foreground">
                {user?.organization?.coursesCount ?? 0}
              </p>
            </div>
          )}
        </CardHeader>
        {isAdmin && (
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleViewCourses}>
              <Library className="mr-2 h-4 w-4" />
              View all courses
            </Button>
            <Button onClick={handleAddCourse}>
              <Plus className="mr-2 h-4 w-4" />
              Create course
            </Button>
          </CardContent>
        )}
      </Card>

      <Card className="min-h-[400px] overflow-hidden border border-border/70">
        <CardHeader className="flex items-center gap-2 border-b pb-3">
          <BookOpen className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-medium text-muted-foreground">
            Catalog
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default Courses;
