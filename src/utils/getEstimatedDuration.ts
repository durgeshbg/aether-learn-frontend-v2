import type { CodeAssesment } from "@/types/CodeAssesment";
import type { Module } from "@/types/Module";
import type { Quiz } from "@/types/Quiz";

export const getEstimatedDuration = (
  objects: Module[] | Quiz[] | CodeAssesment[],
) => {
  const totalMinutes = objects.reduce(
    (sum, obj) => sum + (obj.durationMinutes || 0),
    0,
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};
