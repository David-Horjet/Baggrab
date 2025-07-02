import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  let message = "Internal server error";
  let errorDetails = {};

  if (err instanceof Error) {
    message = err.message;
    errorDetails = {
      name: err.name,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    };
  }

  res.status(statusCode).json({
    status: "error",
    message,
    ...errorDetails,
  });
}
