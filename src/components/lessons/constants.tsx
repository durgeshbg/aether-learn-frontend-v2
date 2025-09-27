import { DifficultyLevel } from "@/types/Lesson";
import { Edit3, Plus } from "lucide-react";

export type LessonFormType = {
  type?: "edit" | "create";
};

export const getLessonFormData = (type: LessonFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Lesson" : "Create Lesson",
    subtitle:
      type === "edit"
        ? "Update lesson content and settings"
        : "Create engaging lesson content for your students",
    buttonText: type === "edit" ? "Update" : "Create",
    buttonLoadingText:
      type === "edit" ? "Updating Lesson..." : "Creating Lesson...",
    icon:
      type === "edit" ? (
        <Edit3 className="h-8 w-8 text-white/80" />
      ) : (
        <Plus className="h-8 w-8 text-white/80" />
      ),
    contentTip: (
      <>
        <strong className="text-white/80">Tip:</strong> Use clear explanations,
        examples, and step-by-step instructions. Consider adding interactive
        elements and practical exercises to enhance learning.
      </>
    ),
    objectivesTip: (
      <>
        <strong className="text-white/80">Tip:</strong> Clear objectives help
        students understand what they will learn and achieve by the end of the
        lesson.
      </>
    ),
    guidelines: [
      "Start with clear learning objectives",
      "Break content into digestible sections",
      // "Include practical examples and exercises",
      "End with a summary and next steps",
    ],
    backLinkText: type === "edit" ? "Back to Lesson" : "Back to Course",
  };
};

export const difficultyLevels = [
  { value: DifficultyLevel.ADVANCED, label: "Advanced" },
  { value: DifficultyLevel.BEGINNER, label: "Beginner" },
  { value: DifficultyLevel.INTERMEDIATE, label: "Intermediate" },
];
