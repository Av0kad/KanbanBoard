import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(72),
    name: z.string().trim().min(1).max(100).optional(),
  })
  .strict();

export class RegisterDto extends createZodDto(RegisterSchema) {}

export const LoginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(72),
  })
  .strict();

export class LoginDto extends createZodDto(LoginSchema) {}

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
