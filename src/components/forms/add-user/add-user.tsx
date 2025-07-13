import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { formSchema, roles } from './constants';
import TestData from './test-data';
import { useMutation } from '@tanstack/react-query';
import { userKeys } from '@/tanstack/keys/userKeys';
import { createUser } from '@/services/users';
import { axiosInstance } from '@/utils/axiosInstance';

export default function AddUserForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      organizationId: '',
      orgAdmin: false,
      role: 'USER',
    },
  });

  const { mutate } = useMutation({
    mutationKey: userKeys.create(),
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return createUser(axiosInstance, data);
    },
    meta: {
      notify: true,
      successMessage: 'User created successfully',
      invalidatesQueries: userKeys.all(),
    },
  });

  // TODO: Fetch organizations from API or context
  const organizations = [
    { id: 'org1', name: 'Organization One' },
    { id: 'org2', name: 'Organization Two' },
    { id: 'org3', name: 'Organization Three' },
  ];

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
    form.reset();
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <Form {...form}>
        <h1 className='text-4xl font-bold mb-6'>Create User</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md'
        >
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='Smith' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='organizationId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select an Organization' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='orgAdmin'
            render={({ field }) => (
              <FormItem className='flex items-center space-x-2'>
                <FormControl>
                  <Label className='flex items-center space-x-2'>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                    <span>Organization Admin</span>
                  </Label>
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
                  <Input placeholder='name@mail.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='••••••••' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select role' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>Create</Button>

          <TestData form={form} />
        </form>
      </Form>
    </div>
  );
}
