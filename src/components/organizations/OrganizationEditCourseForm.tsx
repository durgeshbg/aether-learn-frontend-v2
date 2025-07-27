import { OrganizationCourseUpdateSchema } from '@/types/Organization';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { organizationKeys } from '@/tanstack/keys/organizationKeys';
import {
  addOrganizationCourses,
  removeOrganizationCourses,
} from '@/services/organization';
import { axiosInstance } from '@/utils/axiosInstance';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { routes } from '@/static-data/routes';
import { getCourses, getNonOrganizationCourses } from '@/services/course';
import type { Course } from '@/types/Course';
import { courseKeys } from '@/tanstack/keys/courseKeys';
import {
  getOrganizationCoursesEditFormData,
  type IformType,
} from './constants';

const OrganizationEditCourseForm = () => {
  const { organizationId = '' } = useParams<{
    organizationId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formType: IformType =
    searchParams.get('type') === 'remove' ? 'remove' : 'add';
  const { title, btnText, description } =
    getOrganizationCoursesEditFormData(formType);

  const form = useForm<z.infer<typeof OrganizationCourseUpdateSchema>>({
    resolver: zodResolver(OrganizationCourseUpdateSchema),
    defaultValues: {
      courseIds: [],
    },
  });

  const { data: courses } = useSuspenseQuery({
    queryKey:
      formType === 'add'
        ? courseKeys.allNonOrganization(organizationId)
        : courseKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return formType === 'add'
        ? getNonOrganizationCourses(axiosInstance, { organizationId })
        : getCourses(axiosInstance, { organizationId });
    },
    select: (data: { courses: Course[] }) => data.courses,
  });

  const { mutate: addCourses } = useMutation({
    mutationKey: organizationKeys.addCourses(organizationId),
    mutationFn: async (courseIds: string[]) => {
      return addOrganizationCourses(
        axiosInstance,
        { id: organizationId },
        {
          courseIds,
        }
      );
    },
    meta: {
      notify: true,
      successMessage: 'Courses added successfully',
      invalidatesQueries: [
        courseKeys.getByOrganization(organizationId),
        courseKeys.allNonOrganization(organizationId),
      ],
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  const { mutate: removeCourses } = useMutation({
    mutationKey: organizationKeys.removeCourses(organizationId),
    mutationFn: async (courseIds: string[]) => {
      return removeOrganizationCourses(
        axiosInstance,
        { id: organizationId },
        {
          courseIds,
        }
      );
    },
    meta: {
      notify: true,
      successMessage: 'Courses removed successfully',
      invalidatesQueries: [
        courseKeys.getByOrganization(organizationId),
        courseKeys.allNonOrganization(organizationId),
      ],
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  function onSubmit(data: z.infer<typeof OrganizationCourseUpdateSchema>) {
    if (formType === 'add') {
      addCourses(data.courseIds);
    } else {
      removeCourses(data.courseIds);
    }
  }

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
            name='courseIds'
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormDescription>{description}</FormDescription>
                </div>
                {courses.map((course) => (
                  <FormField
                    key={course.id}
                    control={form.control}
                    name='courseIds'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={course.id}
                          className='flex flex-row items-center gap-2'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(course.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, course.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== course.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='text-sm font-normal'>
                            {course.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>{btnText}</Button>
        </form>
      </Form>
    </div>
  );
};

export default OrganizationEditCourseForm;
