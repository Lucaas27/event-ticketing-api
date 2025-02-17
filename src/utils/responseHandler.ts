import { ApiResponse } from "@/types/api.types";
import { Response } from "express";

export class ResponseHandler {
  static success<T>(res: Response, data: T, status: number = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      data
    };
    res.status(status).json(response);
  }

  static error(res: Response, message: string, status: number = 500, details?: unknown): void {
    if (details instanceof Error) {
      console.error(details.stack);
    }
    const response: ApiResponse = {
      success: false,
      error: {
        message,
        ...(typeof details === "object" && details !== null ? { details } : {})
      }
    };
    res.status(status).json(response);
  }
}
