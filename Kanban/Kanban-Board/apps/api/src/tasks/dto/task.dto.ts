import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(150),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  boardId: z.string().uuid().optional(),
});

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
