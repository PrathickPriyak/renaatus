export function isProductionRuntime(): boolean {
  if (process.env.APP_ENV === "production") {
    return true;
  }
  if (process.env.APP_ENV === "preview" || process.env.APP_ENV === "development") {
    return false;
  }
  return process.env.NODE_ENV === "production";
}
