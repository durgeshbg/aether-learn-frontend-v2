import { creatOrganization } from '@/services/organization';
import { organizationKeys } from '@/tanstack/keys/organizationKeys';
import { OrganizationCreateSchema } from '@/types/Organization';
import { axiosInstance } from '@/utils/axiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { routes } from '@/static-data/routes';
import { useNavigate } from 'react-router';

const OrganizationCreateForm = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof OrganizationCreateSchema>>({
    resolver: zodResolver(OrganizationCreateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { mutate } = useMutation({
    mutationKey: organizationKeys.create(),
    mutationFn: async (data: z.infer<typeof OrganizationCreateSchema>) => {
      return creatOrganization(axiosInstance, data);
    },
    meta: {
      notify: true,
      successMessage: 'Organization created successfully',
      invalidatesQueries: organizationKeys.all(),
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.ORGANIZATIONS);
    },
  });

  const onSubmit = (data: z.infer<typeof OrganizationCreateSchema>) => {
    if (data.logoUrl === '') {
      delete data.logoUrl; // Remove logoUrl if it's empty
    }
    if (data.websiteUrl === '') {
      delete data.websiteUrl; // Remove websiteUrl if it's empty
    }
    if (data.email === '') {
      delete data.email; // Remove email if it's empty
    }
    if (data.phone === '') {
      delete data.phone; // Remove phone if it's empty
    }
    if (data.address === '') {
      delete data.address; // Remove address if it's empty
    }

    mutate(data);
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <Form {...form}>
        <h1 className='text-4xl font-bold mb-6'>Create Organization</h1>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder='Devmasters' {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder='A team of expert developers' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='devmaster@mail.io' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder='xxxxx-xxxxx' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder='123 Main St, City, Country' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='logoUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder='https://devmasters.io/logo.png'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='websiteUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder='https://devmasters.io' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>Create</Button>
        </form>
      </Form>
    </div>
  );
};

export default OrganizationCreateForm;
