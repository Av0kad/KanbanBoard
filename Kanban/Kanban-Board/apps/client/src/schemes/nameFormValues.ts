import { z } from "zod";

export const workspaceNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name must be at most 100 characters"),
});

export const boardNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Board name is required")
    .max(100, "Board name must be at most 100 characters"),
});

export const taskTitleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(150, "Task title must be at most 150 characters"),
});

export type NameFormValues = {
  name: string;
};
