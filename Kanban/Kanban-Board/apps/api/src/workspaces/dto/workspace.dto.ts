import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateWorkspaceSchema = z.object({
  title: z.string().min(1).max(100),
});

export class CreateWorkspaceDto extends createZodDto(CreateWorkspaceSchema) {}

export const UpdateWorkspaceSchema = z.object({
  title: z.string().min(1).max(100).optional(),
});

export class UpdateWorkspaceDto extends createZodDto(UpdateWorkspaceSchema) {}

export const InviteUserToWorkspaceSchema = z.object({
  email: z.string().email(),
});

export class InviteUserToWorkspaceDto extends createZodDto(
  InviteUserToWorkspaceSchema,
) {}

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
export type InviteUserToWorkspaceInput = z.infer<
  typeof InviteUserToWorkspaceSchema
>;
