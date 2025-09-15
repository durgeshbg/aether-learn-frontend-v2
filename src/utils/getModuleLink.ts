import { routes } from "@/static-data/routes";
import type { ModuleLink } from "@/types/User";

export const getModuleLink = (module: ModuleLink | null) => {
  if (!module) return "#";
  return routes.MODULE_DETAILS(
    module.lesson.course.id,
    module.lesson.id,
    module.id,
  );
};
