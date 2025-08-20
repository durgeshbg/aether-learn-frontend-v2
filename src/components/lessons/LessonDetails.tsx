import { getLessonById } from "@/services/lesson";
import { getModules } from "@/services/module";
import { routes } from "@/static-data/routes";
import { lessonKeys } from "@/tanstack/keys/lessonKeys";
import { moduleKeys } from "@/tanstack/keys/moduleKeys";
import type { Lesson } from "@/types/Lesson";
import type { Module } from "@/types/Module";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";

const LessonDetails = () => {
  const { courseId = "", lessonId = "" } = useParams<{
    courseId: string;
    lessonId: string;
  }>();

  const { data: lesson } = useSuspenseQuery({
    queryKey: lessonKeys.getById(courseId, lessonId),
    queryFn: async () => {
      return getLessonById(axiosInstance, { courseId, id: lessonId });
    },
    select: (data: { lesson: Lesson }) => data.lesson,
  });

  const { data: modules } = useSuspenseQuery({
    queryKey: moduleKeys.all(courseId, lessonId),
    queryFn: async () => {
      return getModules(axiosInstance, { courseId, lessonId });
    },
    select: (data: { modules: Module[] }) => data.modules,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lesson Details</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Title</h2>
        <p>{lesson.title}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Content</h2>
        <p>{lesson.content}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Modules</h2>
        <ul>
          {modules.map((module) => (
            <li key={module.id}>
              <Link
                className="text-blue-500 hover:underline"
                to={routes.MODULE_DETAILS(courseId, lessonId, module.id)}
              >
                {module.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LessonDetails;
