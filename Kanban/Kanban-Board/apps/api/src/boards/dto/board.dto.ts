import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateBoardSchema = z.object({
  title: z.string().min(1).max(100),
});

export class CreateBoardDto extends createZodDto(CreateBoardSchema) {}

export const UpdateBoardSchema = z.object({
  title: z.string().min(1).max(100).optional(),
});

export class UpdateBoardDto extends createZodDto(UpdateBoardSchema) {}

export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;
