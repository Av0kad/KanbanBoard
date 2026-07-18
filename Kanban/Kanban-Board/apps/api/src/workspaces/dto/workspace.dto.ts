import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateWorkspaceSchema = z
  .object({
    title: z.string().trim().min(1).max(100),
  })
  .strict();

export class CreateWorkspaceDto extends createZodDto(CreateWorkspaceSchema) {}

export const UpdateWorkspaceSchema = CreateWorkspaceSchema.partial();

export class UpdateWorkspaceDto extends createZodDto(UpdateWorkspaceSchema) {}

export const InviteUserToWorkspaceSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
  })
  .strict();

export class InviteUserToWorkspaceDto extends createZodDto(
  InviteUserToWorkspaceSchema,
) {}

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;

export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;

export type InviteUserToWorkspaceInput = z.infer<
  typeof InviteUserToWorkspaceSchema
>;
