import { useNavigate, useParams } from 'react-router';
import { getModuleFormData, languages, type ModuleFormType } from './constnats';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { moduleKeys } from '@/tanstack/keys/moduleKeys';
import { createModule, getModuleById, updateModule } from '@/services/module';
import { axiosInstance } from '@/utils/axiosInstance';
import {
  ModuleCreateSchema,
  ModuleUpdateSchema,
  type Module,
} from '@/types/Module';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import { routes } from '@/static-data/routes';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const ModuleCreateForm = ({ type = 'create' }: ModuleFormType) => {
  const {
    courseId = '',
    lessonId = '',
    moduleId = '',
  } = useParams<{
    courseId: string;
    lessonId: string;
    moduleId: string;
  }>();
  const { title, buttonText } = getModuleFormData(type);
  const navigate = useNavigate();

  const { data: module } = useSuspenseQuery({
    queryKey: moduleKeys.getById(courseId, lessonId, moduleId),
    queryFn: async () => {
      return type === 'edit'
        ? getModuleById(axiosInstance, { courseId, lessonId, id: moduleId })
        : null;
    },
    select: (data: { module: Module }) => data?.module,
  });

  const form = useForm<z.infer<typeof ModuleCreateSchema>>({
    resolver: zodResolver(ModuleCreateSchema),
    defaultValues: {
      ...(type === 'edit' && module
        ? {
            title: module.title,
            content: module.content,
            code: module?.code,
            languageId: module?.languageId,
          }
        : {
            languageId: languages[7].value,
          }),
    },
  });

  const { mutate: createModuleMutation } = useMutation({
    mutationKey: moduleKeys.create(courseId, lessonId),
    mutationFn: async (data: z.infer<typeof ModuleCreateSchema>) => {
      return createModule(axiosInstance, { courseId, lessonId }, data);
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.LESSON_DETAILS(courseId, lessonId));
    },
    meta: {
      notify: true,
      successMessage: 'Module created successfully',
      invalidatesQueries: moduleKeys.all(courseId, lessonId),
    },
  });

  const { mutate: updateModuleMutation } = useMutation({
    mutationKey: moduleKeys.update(courseId, lessonId, moduleId),
    mutationFn: async (data: z.infer<typeof ModuleUpdateSchema>) => {
      return updateModule(
        axiosInstance,
        { courseId, lessonId, id: moduleId },
        data
      );
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.MODULE_DETAILS(courseId, lessonId, moduleId));
    },
    meta: {
      notify: true,
      successMessage: 'Module updated successfully',
      invalidatesQueries: moduleKeys.all(courseId, lessonId),
    },
  });

  const onSubmit = (
    data:
      | z.infer<typeof ModuleCreateSchema>
      | z.infer<typeof ModuleUpdateSchema>
  ) => {
    if (type === 'create') {
      createModuleMutation(data as z.infer<typeof ModuleCreateSchema>);
    } else {
      updateModuleMutation(data as z.infer<typeof ModuleUpdateSchema>);
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
                  <Input placeholder='Enter module title' {...field} />
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
                  <Input placeholder='Enter module content' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code: </FormLabel>
                <FormControl>
                  <Input placeholder='Enter module code' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='languageId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select language' />
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

          <Button type='submit'>{buttonText}</Button>
        </form>
      </Form>
    </div>
  );
};

export default ModuleCreateForm;
