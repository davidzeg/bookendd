export function getSiteUrl(): string {
  const envUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL;

  if (!envUrl) {
    throw new Error(
      "Site URL is not configured. Set SITE_URL or NEXT_PUBLIC_SITE_URL."
    );
  }

  const normalized = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;

  try {
    return new URL(normalized).origin;
  } catch {
    throw new Error(
      "Site URL is invalid. Please provide a valid absolute URL."
    );
  }
}
