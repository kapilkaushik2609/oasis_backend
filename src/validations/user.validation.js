import { z } from 'zod';

export const signupValidation = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6).max(20, 'Max length of password is 20'),
});

export const loginUserValidation = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6).max(20, 'Max length of password is 20'),
});
