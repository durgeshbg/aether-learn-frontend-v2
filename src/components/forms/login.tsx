import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userKeys } from '@/tanstack/keys/userKeys';
import { login } from '@/services/users';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/utils/axiosInstance';
import { localStorageKeys } from '@/static-data/localStorage';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router';
import { routes } from '@/static-data/routes';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.',
  }),
});

export function LoginForm() {
  const { isAuthenticated } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate } = useMutation({
    mutationKey: userKeys.login(),
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await login(axiosInstance, data);
    },
    meta: {
      notify: true,
      successMessage: 'Login successful!',
    },
    onSuccess: (data) => {
      localStorage.setItem(localStorageKeys.ACCESS_TOKEN, data.token);
      form.reset();
    },
  });

  function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    mutate({ email, password });
  }

  if (isAuthenticated) return <Navigate to={routes.HOME} replace />;

  return (
    <div className='flex flex-col h-screen justify-center items-center'>
      <Form {...form}>
        <h1 className='text-4xl font-bold mb-6'>Login</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='name@mail.com' {...field} />
                </FormControl>
                <FormDescription>
                  Enter your registered email address.
                </FormDescription>
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
                <FormDescription>Enter your account password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
          {/* For testing purposes, use */}
          <div className='flex gap-3'>
            <Button
              variant='secondary'
              type='button'
              onClick={() => {
                form.setValue('email', 'admin1@codeverse.academy');
                form.setValue('password', 'password');
              }}
            >
              Admin
            </Button>
            <Button
              variant='secondary'
              type='button'
              onClick={() => {
                form.setValue('email', 'admin2@devmasters.io');
                form.setValue('password', 'password');
              }}
            >
              Org Admin
            </Button>
            <Button
              variant='secondary'
              type='button'
              onClick={() => {
                form.setValue('email', 'user1@example.com');
                form.setValue('password', 'password');
              }}
            >
              User
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
