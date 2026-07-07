import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export type UserResponse = z.infer<typeof UserResponseSchema>;
