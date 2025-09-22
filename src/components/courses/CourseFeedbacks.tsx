import { getCourseFeedbacks } from "@/services/course";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
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

  if (!feedbacks?.length) {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8 bg-gradient-to-br from-background to-muted/30 backdrop-blur-xl border border-border/20">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-card/40 border border-border/30 rounded-2xl p-8 shadow-2xl shadow-foreground/10">
            <p className="text-muted-foreground text-center text-lg">
              No feedbacks found for this course
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 bg-gradient-to-br from-background to-muted/30 backdrop-blur-xl border border-border/20">
      <Button
        onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
        className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Course
      </Button>
      {/* Main container with glassmorphic background */}
      <div className="max-w-7xl mx-auto">
        {/* Optional header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Course Feedbacks
          </h1>
          <p className="text-muted-foreground">What learners are saying</p>
        </div>

        {/* Grid container for feedbacks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-card/40 border border-border/30 rounded-2xl p-6 shadow-lg shadow-foreground/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <p className="text-foreground mb-4">"{feedback.comment}"</p>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {feedback?.user?.firstName[0]}
                  {feedback?.user?.lastName ? feedback.user.lastName[0] : ""}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {feedback?.user?.firstName} {feedback?.user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rating: {feedback.rating} / 5
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseFeedbacks;
