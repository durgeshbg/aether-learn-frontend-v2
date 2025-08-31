import { DifficultyLevel } from "@/types/Lesson";

export type LessonFormType = {
  type?: "edit" | "create";
};

export const getLessonFormData = (type: LessonFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Lesson" : "Create Lesson",
    buttonText: type === "edit" ? "Update" : "Create",
  };
};

export const difficultyLevels = [
  { value: DifficultyLevel.ADVANCED, label: "Advanced" },
  { value: DifficultyLevel.BEGINNER, label: "Beginner" },
  { value: DifficultyLevel.INTERMEDIATE, label: "Intermediate" },
];
