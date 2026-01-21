import { ZodError, type ZodIssue } from "zod";

export type ValidationErrorDetail = {
  field: string;
  message: string;
};

export function formatZodIssues(issues: ZodIssue[]): ValidationErrorDetail[] {
  return issues.map((issue) => ({
    field: issue.path.length ? issue.path.join(".") : "body",
    message: issue.message,
  }));
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}
