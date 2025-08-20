import { useNavigate, useParams } from "react-router";
import { getQuestionFormData, type QuestionFormType } from "./constants";
import {
  QuestionCreateSchema,
  QuestionUpdateSchema,
  type Question,
} from "@/types/Question";
import { routes } from "@/static-data/routes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import type z from "zod";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
} from "@/services/question";
import { questionKeys } from "@/tanstack/keys/question";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const QuestionCreateForm = ({ type = "create" }: QuestionFormType) => {
  const { title, buttonText } = getQuestionFormData(type);
  const {
    courseId = "",
    quizId = "",
    questionId = "",
  } = useParams<{
    courseId: string;
    quizId: string;
    questionId: string;
  }>();
  const navigate = useNavigate();

  const { data: question } = useSuspenseQuery({
    queryKey: questionKeys.all(courseId, quizId),
    queryFn: async () => {
      return type === "edit"
        ? getQuestions(axiosInstance, { courseId, quizId })
        : null;
    },
    select: (data: { questions: Question[] }) => {
      return data?.questions.find((q) => q.id === questionId) || null;
    },
  });

  const form = useForm<z.infer<typeof QuestionCreateSchema>>({
    resolver: zodResolver(QuestionCreateSchema),
    defaultValues: {
      ...(type === "edit" && question
        ? {
            text: question.text,
            options: question.options,
            answer: question.answer,
            explaination: question.explaination,
          }
        : {
            text: "",
            options: ["Option 1", "Option 2"],
            answer: 1,
            explaination: "",
          }),
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "options" as never,
    control: form.control,
  });

  const { mutate: createQuestionMutation } = useMutation({
    mutationKey: questionKeys.create(courseId, quizId),
    mutationFn: async (data: z.infer<typeof QuestionCreateSchema>) => {
      return createQuestion(axiosInstance, { courseId, quizId }, data);
    },
    onSuccess: () => {
      navigate(routes.QUIZ_DETAILS(courseId, quizId));
    },
    meta: {
      notify: true,
      successMessage: "Question created successfully",
      invalidatesQueries: questionKeys.all(courseId, quizId),
    },
  });
  const { mutate: updateQuestionMutation } = useMutation({
    mutationKey: questionKeys.update(courseId, quizId, questionId),
    mutationFn: async (data: z.infer<typeof QuestionUpdateSchema>) => {
      return updateQuestion(
        axiosInstance,
        { courseId, quizId, id: questionId },
        data,
      );
    },
    onSuccess: () => {
      navigate(routes.QUIZ_DETAILS(courseId, quizId));
    },
    meta: {
      notify: true,
      successMessage: "Question updated successfully",
      invalidatesQueries: questionKeys.all(courseId, quizId),
    },
  });
  const onSubmit = (data: z.infer<typeof QuestionCreateSchema>) => {
    if (type === "create") {
      createQuestionMutation(data);
    } else {
      updateQuestionMutation(data);
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
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question: </FormLabel>
                <FormControl>
                  <Input placeholder="Enter question text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation: </FormLabel>
                <FormControl>
                  <Input placeholder="Enter question explanation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`options.${index}` as never}
                render={({ field: optionField }) => (
                  <FormItem>
                    <FormLabel>Option {index + 1}: </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter option ${index + 1}`}
                        {...optionField}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="destructive"
                      className="max-w-min"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              onClick={() => append("")}
              className="bg-green-500 text-white"
            >
              Add Option
            </Button>
          </div>

          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correct Answer: </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter the index of the correct option"
                    {...field}
                  />
                </FormControl>
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

export default QuestionCreateForm;
