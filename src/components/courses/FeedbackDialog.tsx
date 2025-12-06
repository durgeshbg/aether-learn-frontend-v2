import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { CourseFeedbackSchema } from "@/types/Course";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { useMutation } from "@tanstack/react-query";
import { createCourseFeedback } from "@/services/course";
import { axiosInstance } from "@/utils/axiosInstance";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { courseKeys } from "@/tanstack/keys/courseKeys";

export function FeedbackDialog({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const createFeedback = useForm<z.infer<typeof CourseFeedbackSchema>>({
    resolver: zodResolver(CourseFeedbackSchema),
    defaultValues: {
      comment: "",
      rating: 4,
    },
  });

  const { mutate: createFeedbackMutate, isPending: isCourseFeedbackPending } =
    useMutation({
      mutationKey: courseKeys.createFeedback(courseId),
      mutationFn: async (data: z.infer<typeof CourseFeedbackSchema>) => {
        return createCourseFeedback(axiosInstance, { id: courseId }, data);
      },
      meta: {
        notify: true,
        successMessage: "Feedback submitted successfully",
        invalidatesQueries: courseKeys.getById(courseId),
      },
      onSettled: () => {
        createFeedback.reset();
        setOpen(false);
        setHoveredStar(0);
      },
    });

  const handleSubmit = createFeedback.handleSubmit((data) => {
    createFeedbackMutate(data);
  });

  const handleStarClick = (rating: number) => {
    createFeedback.setValue("rating", rating);
  };

  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Give feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share your experience</DialogTitle>
          <DialogDescription>
            Help course authors understand what resonated and what needs work.
          </DialogDescription>
        </DialogHeader>
        <Form {...createFeedback}>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <FormField
                control={createFeedback.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <Label>Rating</Label>
                    <FormControl>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="rounded-md p-1 transition-colors hover:bg-muted"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                star <= (hoveredStar || field.value)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={createFeedback.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="comment">Comment</Label>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="comment"
                        placeholder="Share your thoughts..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCourseFeedbackPending}>
                {isCourseFeedbackPending ? "Submitting..." : "Submit feedback"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
