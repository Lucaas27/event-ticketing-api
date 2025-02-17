/* eslint-disable @typescript-eslint/no-unused-vars */
import { ResponseHandler } from "@/utils/responseHandler";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

class ErrorMiddleware {
  handle(err: Error, req: Request, res: Response, next: NextFunction): void {
    // Handle JSON parsing errors
    if (err instanceof SyntaxError && "body" in err) {
      ResponseHandler.error(res, "Invalid JSON format", 400);
      return;
    }

    // Log the error for debugging
    console.error("Error:", err);

    // Send generic error response
    ResponseHandler.error(res, "Something went wrong! Please try again later.", 500);
  }
}

class LoggerMiddleware {
  handle(req: Request, res: Response, next: NextFunction): void {
    // Log after response is sent
    res.on("finish", () => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode}`);
    });
    next();
  }
}

class RequestValidationMiddleware {
  handle(schema: AnyZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          ResponseHandler.error(res, "Validation failed", 400, {
            validationErrors: error.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message
            }))
          });
        } else {
          next(error);
        }
      }
    };
  }
}

export const errorHandler = new ErrorMiddleware();
export const logger = new LoggerMiddleware();
export const validateRequest = new RequestValidationMiddleware();
