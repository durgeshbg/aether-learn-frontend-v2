import { deleteModule, getModuleById } from "@/services/module";
import { moduleKeys } from "@/tanstack/keys/moduleKeys";
import type { Module } from "@/types/Module";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { LANGUAGES_MAP } from "@/static-data/languages";

const ModuleDetails = () => {
  const {
    courseId = "",
    lessonId = "",
    moduleId = "",
  } = useParams<{
    courseId: string;
    lessonId: string;
    moduleId: string;
  }>();
  const navigate = useNavigate();

  const { data: module } = useSuspenseQuery({
    queryKey: moduleKeys.getById(courseId, lessonId, moduleId),
    queryFn: async () => {
      return getModuleById(axiosInstance, { courseId, lessonId, id: moduleId });
    },
    select: (data: { module: Module }) => data.module,
  });

  const { mutate: deleteModuleMutation } = useMutation({
    mutationKey: moduleKeys.delete(courseId, lessonId, moduleId),
    mutationFn: async () => {
      return deleteModule(axiosInstance, { courseId, lessonId, id: moduleId });
    },
    onSuccess: () => {
      navigate(routes.LESSON_DETAILS(courseId, lessonId));
    },
    meta: {
      notify: true,
      successMessage: "Module deleted successfully",
      invalidatesQueries: moduleKeys.all(courseId, lessonId),
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Module Details</h1>
      <div className="flex mb-4">
        <Button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
          onClick={() =>
            navigate(routes.MODULE_EDIT(courseId, lessonId, moduleId))
          }
        >
          Edit
        </Button>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => deleteModuleMutation()}
        >
          Delete
        </Button>
      </div>
      <p className="text-xl font-semibold mb-2">Title: {module.title}</p>
      <p className="text-lg mb-4">{module.content}</p>
      <p className="text-lg mb-4">Code: {module.code}</p>
      <p className="text-lg mb-4">
        Language: {LANGUAGES_MAP[module.languageId]?.label}
      </p>
    </div>
  );
};

export default ModuleDetails;
