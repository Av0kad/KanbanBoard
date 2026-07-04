import { z } from "zod";

export const workspaceNameVal = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace needs a name!")
    .regex(/^[a-z]*$/, "Workspace name can contain only lowercase letters.")
    .min(5, "Workspace name must be at least 5 characters")
    .max(30, "Workspace must be at most 30 characters"),
});

export const requiredNameSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
});

export type NameFormValues = z.infer<typeof requiredNameSchema>;
