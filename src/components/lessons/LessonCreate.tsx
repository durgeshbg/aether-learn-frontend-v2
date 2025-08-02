import { useForm } from 'react-hook-form';
import { getLessonFormData, type LessonFormType } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LessonCreateSchema,
  LessonUpdateSchema,
  type Lesson,
} from '@/types/Lesson';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { lessonKeys } from '@/tanstack/keys/lessonKeys';
import { useNavigate, useParams } from 'react-router';
import { createLesson, getLessonById, updateLesson } from '@/services/lesson';
import { axiosInstance } from '@/utils/axiosInstance';
import { routes } from '@/static-data/routes';
import type z from 'zod';
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

const LessonCreateForm = ({ type = 'create' }: LessonFormType) => {
  const { courseId = '', lessonId = '' } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const { title, buttonText } = getLessonFormData(type);
  const navigate = useNavigate();

  const { data: lesson } = useSuspenseQuery({
    queryKey: lessonKeys.getById(courseId, lessonId),
    queryFn: async () => {
      return type === 'edit'
        ? getLessonById(axiosInstance, { courseId, id: lessonId })
        : null;
    },
    select: (data: { lesson: Lesson }) => data?.lesson,
  });

  const form = useForm<z.infer<typeof LessonCreateSchema>>({
    resolver: zodResolver(LessonCreateSchema),
    defaultValues: {
      ...(type === 'edit' && lesson
        ? {
            title: lesson.title,
            content: lesson.content,
          }
        : {}),
    },
  });

  const { mutate: createLessonMutation } = useMutation({
    mutationKey: lessonKeys.create(courseId),
    mutationFn: async (data: z.infer<typeof LessonCreateSchema>) => {
      return createLesson(axiosInstance, { courseId }, data);
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: 'Lesson created successfully',
      invalidatesQueries: lessonKeys.all(courseId),
    },
  });

  const { mutate: updateLessonMutation } = useMutation({
    mutationKey: lessonKeys.update(courseId, lessonId),
    mutationFn: async (data: z.infer<typeof LessonUpdateSchema>) => {
      return updateLesson(axiosInstance, { courseId, id: lessonId }, data);
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.LESSON_DETAILS(courseId, lessonId));
    },
    meta: {
      notify: true,
      successMessage: 'Lesson updated successfully',
      invalidatesQueries: lessonKeys.all(courseId),
    },
  });

  const onSubmit = (
    data:
      | z.infer<typeof LessonCreateSchema>
      | z.infer<typeof LessonUpdateSchema>
  ) => {
    if (type === 'create') {
      createLessonMutation(data as z.infer<typeof LessonCreateSchema>);
    } else {
      updateLessonMutation(data as z.infer<typeof LessonUpdateSchema>);
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
                  <Input placeholder='Enter lesson title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content: </FormLabel>
                <FormControl>
                  <Input placeholder='Enter lesson content' {...field} />
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

export default LessonCreateForm;
