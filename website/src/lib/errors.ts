export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly expose: boolean;

  constructor(
    message: string,
    code: string,
    status = 400,
    expose = true,
    cause?: unknown,
  ) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.expose = expose;
  }
}

export class ValidationError extends AppError {
  readonly fields?: Record<string, string>;

  constructor(message: string, cause?: unknown, fields?: Record<string, string>) {
    super(message, "VALIDATION_ERROR", 400, true, cause);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401, true);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404, true);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, "RATE_LIMITED", 429, true);
    this.name = "RateLimitError";
  }
}

export type PublicError = {
  message: string;
  status: number;
  code: string;
};

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

export function toPublicError(error: unknown): PublicError {
  if (error instanceof AppError && error.expose) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
    };
  }

  return {
    message: GENERIC_MESSAGE,
    status: 500,
    code: "INTERNAL_ERROR",
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}
