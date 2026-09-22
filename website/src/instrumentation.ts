export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { logger } = await import("@/lib/logger");
  logger.info("app_start", {
    nodeEnv: process.env.NODE_ENV,
    appEnv: process.env.APP_ENV ?? "development",
  });
}
