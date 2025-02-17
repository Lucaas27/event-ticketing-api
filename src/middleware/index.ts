import { NextFunction, Request, Response } from "express";

class ErrorMiddleware {
  handle(err: Error, req: Request, res: Response): void {
    console.error(err.name, err.message);
    res.status(500).json({ error: "Something went wrong! Please try again later." });
  }
}

class LoggerMiddleware {
  handle(req: Request, res: Response, next: NextFunction): void {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  }
}

export const errorHandler = new ErrorMiddleware();
export const logger = new LoggerMiddleware();
