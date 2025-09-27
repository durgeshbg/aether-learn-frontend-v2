import type { Lesson } from "@/types/Lesson";
import { getEstimatedDuration } from "@/utils/getEstimatedDuration";
import lastTimeAgo from "@/utils/lastTimeAgo";

export const getLessonStats = (lesson: Lesson) => ({
  totalModules: lesson.modules?.length || 0,
  estimatedDuration: getEstimatedDuration(lesson.modules || []),
  lastUpdated: lastTimeAgo(lesson.updatedAt),
});
