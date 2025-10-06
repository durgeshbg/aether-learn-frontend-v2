import { LANGUAGES_MAP } from "@/static-data/languages";
import type { Module } from "@/types/Module";
import lastTimeAgo from "@/utils/lastTimeAgo";
import { Edit3, Plus } from "lucide-react";

export type ModuleFormType = {
  type?: "edit" | "create";
};

export const getModuleFormData = (type: ModuleFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Module" : "Create Module",
    description:
      type === "edit"
        ? "Update module content and coding examples"
        : "Create an interactive learning module with content and code",
    buttonText: type === "edit" ? "Update" : "Create",
    backButtonText: type === "edit" ? "Back to Module" : "Back to Lesson",
    icon:
      type === "edit" ? (
        <Edit3 className="h-8 w-8 text-white/80" />
      ) : (
        <Plus className="h-8 w-8 text-white/80" />
      ),
    guidelines: [
      "Keep modules focused on a single concept",
      "Include practical, runnable code examples",
      "Explain the 'why' behind concepts",
      "End with a clear summary",
    ],
    codeBestPractices: [
      "Add clear comments explaining complex logic",
      "Use meaningful variable and function names",
      "Keep examples concise and focused",
      "Format code for readability with proper indentation",
      "Test all code before publishing",
      "Include expected outputs for examples",
    ],
  };
};

export const languages = Array.from(LANGUAGES_MAP.values());

export const getModuleStats = (module: Module) => ({
  estimatedDuration: `${module.durationMinutes}m`,
  lastUpdated: lastTimeAgo(module.updatedAt),
});
