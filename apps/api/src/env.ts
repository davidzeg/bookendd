import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CLERK_JWT_KEY: z
    .string()
    .startsWith(
      '-----BEGIN PUBLIC KEY-----',
      'CLERK_JWT_KEY must be a PEM public key',
    ),
  CLERK_AUTHORIZED_PARTIES: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',') : undefined)),
  PORT: z.coerce.number().default(3001),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
