import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateBoardSchema = z
  .object({
    title: z.string().trim().min(1).max(100),
  })
  .strict();

export class CreateBoardDto extends createZodDto(CreateBoardSchema) {}

export const UpdateBoardSchema = CreateBoardSchema.partial();

export class UpdateBoardDto extends createZodDto(UpdateBoardSchema) {}

export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;
