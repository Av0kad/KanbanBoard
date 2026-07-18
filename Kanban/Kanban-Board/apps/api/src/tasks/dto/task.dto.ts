import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(150),
  })
  .strict();

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}

export const UpdateTaskSchema = CreateTaskSchema.partial()
  .extend({
    boardId: z.string().uuid().optional(),
  })
  .strict();

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
