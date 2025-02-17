import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

class ErrorMiddleware {
  handle(err: Error, req: Request, res: Response): void {
    console.error(err.name, err.message);
    res.status(500).json({ error: "Something went wrong! Please try again later." });
  }
}

class LoggerMiddleware {
  handle(req: Request, res: Response, next: NextFunction): void {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.statusCode}`);
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
          res.status(400).json({
            error: "Validation failed",
            details: error.errors.map((e) => ({
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
