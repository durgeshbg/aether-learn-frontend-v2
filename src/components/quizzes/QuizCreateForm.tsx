import { useNavigate, useParams } from 'react-router';
import { getQuizFormData, type QuizFormType } from './constants';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { quizKeys } from '@/tanstack/keys/quizKeys';
import { axiosInstance } from '@/utils/axiosInstance';
import { createQuiz, getQuiz, updateQuiz } from '@/services/quiz';
import { QuizCreateSchema, QuizUpdateSchema, type Quiz } from '@/types/Quiz';
import { routes } from '@/static-data/routes';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

const QuizCreateForm = ({ type = 'create' }: QuizFormType) => {
  const { title, buttonText } = getQuizFormData(type);
  const { courseId = '', quizId = '' } = useParams<{
    courseId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return type === 'edit'
        ? getQuiz(axiosInstance, { courseId, id: quizId })
        : null;
    },
    select: (data: { quiz: Quiz }) => data?.quiz,
  });

  const form = useForm<z.infer<typeof QuizCreateSchema>>({
    resolver: zodResolver(QuizCreateSchema),
    defaultValues: {
      ...(type === 'edit' && quiz
        ? {
            title: quiz.title,
            description: quiz.description,
          }
        : {}),
    },
  });

  const { mutate: createQuizMutation } = useMutation({
    mutationKey: quizKeys.create(courseId),
    mutationFn: async (data: z.infer<typeof QuizCreateSchema>) => {
      return createQuiz(axiosInstance, { courseId }, data);
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: 'Quiz created successfully',
      invalidatesQueries: quizKeys.all(courseId),
    },
  });

  const { mutate: updateQuizMutation } = useMutation({
    mutationKey: quizKeys.update(courseId, quizId),
    mutationFn: async (data: z.infer<typeof QuizUpdateSchema>) => {
      return updateQuiz(axiosInstance, { courseId, id: quizId }, data);
    },
    onSuccess: () => {
      navigate(routes.QUIZ_DETAILS(courseId, quizId));
    },
    meta: {
      notify: true,
      successMessage: 'Quiz updated successfully',
      invalidatesQueries: quizKeys.all(courseId),
    },
  });

  const onSubmit = (data: z.infer<typeof QuizCreateSchema>) => {
    if (type === 'create') {
      createQuizMutation(data);
    } else {
      updateQuizMutation(data);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <Form {...form}>
        <h1 className='text-4xl font-bold mb-6'>{title}</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title: </FormLabel>
                <FormControl>
                  <Input placeholder='Enter Quiz title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description: </FormLabel>
                <FormControl>
                  <Input placeholder='Enter Quiz description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>{buttonText}</Button>
        </form>
      </Form>
    </div>
  );
};

export default QuizCreateForm;
