import { useForm } from 'react-hook-form';
import { getCourseFormData, type CourseFormType } from './constants';
import {
  CourseCreateSchema,
  CourseUpdateSchema,
  type Course,
} from '@/types/Course';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { courseKeys } from '@/tanstack/keys/courseKeys';
import { axiosInstance } from '@/utils/axiosInstance';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { createCourse, getCourseById, updateCourse } from '@/services/course';
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
import { useNavigate, useParams } from 'react-router';
import { routes } from '@/static-data/routes';

const CrourseCreateForm = ({ type = 'create' }: CourseFormType) => {
  const { title, buttonText } = getCourseFormData(type);
  const navigate = useNavigate();
  const { courseId = '' } = useParams<{ courseId: string }>();

  const { data: course } = useSuspenseQuery({
    queryKey: courseKeys.getById(type === 'edit' ? courseId : ''),
    queryFn: async () => {
      return type === 'edit'
        ? getCourseById(axiosInstance, { id: courseId })
        : null;
    },
    select: (data: { course: Course }) => data?.course,
  });

  const createOrUpdateForm = useForm<z.infer<typeof CourseCreateSchema>>({
    resolver: zodResolver(CourseCreateSchema),
    defaultValues: {
      ...(type === 'edit' && course
        ? {
            name: course.name,
            description: course.description,
            thumbnailUrl: course.thumbnailUrl,
          }
        : {}),
    },
  });

  const { mutate: createCourseMutation } = useMutation({
    mutationKey: courseKeys.create(),
    mutationFn: async (data: z.infer<typeof CourseCreateSchema>) => {
      return createCourse(axiosInstance, data);
    },
    meta: {
      notify: true,
      successMessage: 'Course created successfully',
      invalidatesQueries: courseKeys.all(),
    },
    onSettled: () => {
      createOrUpdateForm.reset();
      navigate(routes.COURSES);
    },
  });

  const { mutate: updateCourseMutation } = useMutation({
    mutationKey: courseKeys.update(courseId),
    mutationFn: async (data: z.infer<typeof CourseUpdateSchema>) => {
      return updateCourse(axiosInstance, { id: courseId }, data);
    },
    meta: {
      notify: true,
      successMessage: 'Course updated successfully',
      invalidatesQueries: courseKeys.all(),
    },
    onSettled: () => {
      createOrUpdateForm.reset();
      navigate(routes.COURSES);
    },
  });

  const onSubmit = (
    data:
      | z.infer<typeof CourseCreateSchema>
      | z.infer<typeof CourseUpdateSchema>
  ) => {
    if (type === 'edit') {
      updateCourseMutation(data as z.infer<typeof CourseUpdateSchema>);
    } else {
      createCourseMutation(data as z.infer<typeof CourseCreateSchema>);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <Form {...createOrUpdateForm}>
        <h1 className='text-4xl font-bold mb-6'>{title}</h1>
        <form
          onSubmit={createOrUpdateForm.handleSubmit(onSubmit)}
          className='space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md'
        >
          <FormField
            control={createOrUpdateForm.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name: </FormLabel>
                <FormControl>
                  <Input placeholder='Enter course name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createOrUpdateForm.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description: </FormLabel>
                <FormControl>
                  <Input placeholder='Enter course description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createOrUpdateForm.control}
            name='thumbnailUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL: </FormLabel>
                <FormControl>
                  <Input placeholder='Enter thumbnail URL' {...field} />
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

export default CrourseCreateForm;
