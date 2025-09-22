import { routes } from "@/static-data/routes";
import { Edit3, Plus, Trash2, Users } from "lucide-react";

export type CourseFormType = {
  type?: "edit" | "create";
};

export const getCourseFormData = (type: CourseFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Course" : "Create Course",
    buttonText: type === "edit" ? "Update" : "Create",
  };
};

export const COURSE_ACTIONS = [
  {
    label: "Edit Course",
    icon: Edit3,
    color: "blue",
    url: (courseId: string) => routes.COURSE_EDIT(courseId),
  },
  {
    label: "Delete Course",
    icon: Trash2,
    color: "red",
    action: "delete",
  },
  {
    label: "Add Lesson",
    icon: Plus,
    color: "emerald",
    url: (courseId: string) => routes.LESSON_CREATE(courseId),
  },
  {
    label: "Add Quiz",
    icon: Plus,
    color: "purple",
    url: (courseId: string) => routes.QUIZ_CREATE(courseId),
  },
  {
    label: "Add Assessment",
    icon: Plus,
    color: "orange",
    url: (courseId: string) => routes.CODE_ASSESSMENT_CREATE(courseId),
  },
  {
    label: "View Feedbacks",
    icon: Users,
    color: "yellow",
    url: (courseId: string) => routes.COURSE_FEEDBACKS(courseId),
  },
];
