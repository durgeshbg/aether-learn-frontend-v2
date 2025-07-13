import z from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First name is required.',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.',
  }),
  organizationId: z.string().optional(),
  orgAdmin: z.boolean().optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

export const roles = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'USER', label: 'User' },
];
