import { getCourseFeedbacks } from "@/services/course";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { routes } from "@/static-data/routes";
import { ArrowLeft } from "lucide-react";

function CourseFeedbacks() {
  const { courseId = "" } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { data: feedbacks } = useQuery({
    queryKey: courseKeys.feedbacks(courseId),
    queryFn: async () => {
      return getCourseFeedbacks(axiosInstance, { id: courseId });
    },
    select: (data) => data.feedbacks,
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to course
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Learner feedback</CardTitle>
          <CardDescription>
            Insights collected from recent submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbacks?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id} className="h-full">
                  <CardContent className="space-y-4 pt-6">
                    <p className="text-sm text-foreground">
                      “{feedback.comment}”
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {feedback?.user?.firstName?.[0]}
                        {feedback?.user?.lastName?.[0] ?? ""}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {feedback?.user?.firstName} {feedback?.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rating {feedback.rating} / 5
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This course hasn’t collected feedback yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseFeedbacks;
