import { z } from 'zod';

export const EnvironmentSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    DATABASE_URL: z.string().url(),

    JWT_SECRET: z.string().min(32),

    JWT_EXPIRES_IN: z.string().min(2).default('7d'),

    CLIENT_URL: z.string().url().default('http://localhost:5173'),

    API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  })
  .passthrough();

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  return EnvironmentSchema.parse(config);
}
