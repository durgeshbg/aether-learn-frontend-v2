import { Outlet, useNavigate, useParams } from "react-router";
import { Code2, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routes } from "@/static-data/routes";
import { Button } from "../ui/button";

const Submissions = () => {
  const navigate = useNavigate();
  const { courseId = "" } = useParams<{
    courseId: string;
  }>();

  const quickLinks = [
    {
      title: "Quiz submissions",
      icon: Trophy,
      action: () => navigate(routes.COURSE_SUBMISSIONS_QUIZZES(courseId)),
    },
    {
      title: "Code submissions",
      icon: Code2,
      action: () =>
        navigate(routes.COURSE_SUBMISSIONS_CODE_ASSESSMENTS(courseId)),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardDescription>Course submissions</CardDescription>
          <CardTitle className="text-3xl">Track your progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review quiz results, code assessments, and detailed feedback in one
            place.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-4 grid-cols-2">
        {quickLinks.map(({ title, icon: Icon, action }) => (
          <Button
            key={title}
            className="cursor-pointer transition-colors hover:border-primary/40"
            onClick={action}
            variant="outline"
            size="lg"
          >
            <Icon className="h-4 w-4" />
            {title}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default Submissions;
