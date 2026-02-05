import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Clerk publishable key is required"),
  EXPO_PUBLIC_API_URL: z.url("API URL must be a valid URL"),
  EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, "Cloudinary cloud name is required"),
  EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z
    .string()
    .min(1, "Cloudinary upload preset is required"),
  EXPO_PUBLIC_POSTHOG_API_KEY: z.string().min(1, "PostHog API key is required"),
  EXPO_PUBLIC_SENTRY_DSN: z.url().optional(),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  EXPO_PUBLIC_POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
});
