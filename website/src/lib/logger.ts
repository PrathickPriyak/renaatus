import type { LogLevel } from "@/lib/env/schema";
import { getErrorMessage } from "@/lib/errors";

const SENSITIVE_KEY_PATTERN =
  /(password|secret|token|authorization|cookie|key|email|phone|resume)/i;

type LogContext = Record<string, unknown>;

function resolveLevel(): LogLevel {
  const fromEnv = process.env.LOG_LEVEL;
  if (fromEnv === "debug" || fromEnv === "info" || fromEnv === "warn" || fromEnv === "error") {
    return fromEnv;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function rank(level: LogLevel): number {
  switch (level) {
    case "debug":
      return 10;
    case "info":
      return 20;
    case "warn":
      return 30;
    case "error":
      return 40;
  }
}

function redact(value: unknown, key?: string): unknown {
  if (key && SENSITIVE_KEY_PATTERN.test(key)) {
    return "[redacted]";
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item));
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([entryKey, entryValue]) => [entryKey, redact(entryValue, entryKey)],
    );
    return Object.fromEntries(entries);
  }

  return value;
}

function emit(level: LogLevel, message: string, context?: LogContext): void {
  if (rank(level) < rank(resolveLevel())) {
    return;
  }

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    env: process.env.APP_ENV ?? process.env.NODE_ENV ?? "development",
    ...(context ? { context: redact(context) } : {}),
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    emit("debug", message, context);
  },
  info(message: string, context?: LogContext): void {
    emit("info", message, context);
  },
  warn(message: string, context?: LogContext): void {
    emit("warn", message, context);
  },
  error(message: string, context?: LogContext): void {
    emit("error", message, context);
  },
  exception(message: string, error: unknown, context?: LogContext): void {
    emit("error", message, {
      ...context,
      errorName: error instanceof Error ? error.name : "unknown",
      errorMessage: getErrorMessage(error),
    });
  },
};
