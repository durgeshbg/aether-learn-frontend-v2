import { DifficultyLevel, type DifficultyLevelType } from "@/types/Lesson";

export const getDifficultyColor = (difficulty?: DifficultyLevelType) => {
  switch (difficulty) {
    case DifficultyLevel.BEGINNER:
      return "text-green-400 bg-green-400/20 border-green-400/30";
    case DifficultyLevel.INTERMEDIATE:
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
    case DifficultyLevel.ADVANCED:
      return "text-red-400 bg-red-400/20 border-red-400/30";
    default:
      return "text-white/60 bg-white/10 border-white/20";
  }
};
