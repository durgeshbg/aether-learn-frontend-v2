import { useNavigate, useParams } from "react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import type z from "zod";
import {
  createCodeAssessment,
  getCodeAssessmentById,
  updateCodeAssessment,
} from "@/services/code-assesment";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { routes } from "@/static-data/routes";
import {
  CodeAssessmentCreateSchema,
  CodeAssessmentUpdateSchema,
  type CodeAssesment,
} from "@/types/CodeAssesment";
import {
  getCodeAssessmentFormData,
  type CodeAssessmentFormType,
} from "./constants";
import { languages } from "../modules/constnats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CodeAssessmentCreateForm = ({
  type = "create",
}: CodeAssessmentFormType) => {
  const { title, buttonText } = getCodeAssessmentFormData(type);
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId?: string;
  }>();
  const navigate = useNavigate();

  const { data: assessment } = useSuspenseQuery({
    queryKey: codeAssessmentKeys.getById(courseId, codeAssessmentId),
    queryFn: async () => {
      return type === "edit"
        ? getCodeAssessmentById(axiosInstance, {
            courseId,
            id: codeAssessmentId,
          })
        : null;
    },
    select: (data: { codeAssessment: CodeAssesment }) => data?.codeAssessment,
  });

  const form = useForm<z.infer<typeof CodeAssessmentCreateSchema>>({
    resolver: zodResolver(CodeAssessmentCreateSchema),
    defaultValues: {
      ...(type === "edit" && assessment
        ? {
            title: assessment.title,
            description: assessment.description,
            instructions: assessment.instructions,
            starterCode: assessment.starterCode,
            languageId: parseInt(assessment.languageId),
          }
        : {
            title: "",
            description: "",
            instructions: "",
            starterCode: "",
            languageId: languages[7].value,
          }),
    },
  });

  const { mutate: createCodeAssessmentMutation } = useMutation({
    mutationKey: codeAssessmentKeys.create(courseId),
    mutationFn: async (data: z.infer<typeof CodeAssessmentCreateSchema>) => {
      return createCodeAssessment(axiosInstance, { courseId }, data);
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Code Assessment created successfully",
      invalidatesQueries: codeAssessmentKeys.all(courseId),
    },
  });

  const { mutate: updateCodeAssessmentMutation } = useMutation({
    mutationKey: codeAssessmentKeys.update(courseId, codeAssessmentId),
    mutationFn: async (data: z.infer<typeof CodeAssessmentUpdateSchema>) => {
      return updateCodeAssessment(
        axiosInstance,
        { courseId, id: codeAssessmentId },
        data,
      );
    },
    onSuccess: () => {
      navigate(routes.CODE_ASSESSMENT_DETAILS(courseId, codeAssessmentId));
    },
    meta: {
      notify: true,
      successMessage: "Code Assessment updated successfully",
      invalidatesQueries: codeAssessmentKeys.all(courseId),
    },
  });

  const onSubmit = (data: z.infer<typeof CodeAssessmentCreateSchema>) => {
    if (type === "create") {
      createCodeAssessmentMutation(data);
    } else {
      updateCodeAssessmentMutation(data);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Form {...form}>
        <h1 className="text-4xl font-bold mb-6">{title}</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title: </FormLabel>
                <FormControl>
                  <Input placeholder="Enter assessment title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description: </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter assessment description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions: </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter assessment instructions"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="starterCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starter Code: </FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter starter code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="languageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem
                        key={language.value}
                        value={language.value.toString()}
                      >
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{buttonText}</Button>
        </form>
      </Form>
    </div>
  );
};

export default CodeAssessmentCreateForm;
