import { ResponseHandler } from "@/utils/responseHandler";
import { Request, Response } from "express";

class HealthController {
  constructor() {}

  async getHealth(req: Request, res: Response) {
    ResponseHandler.success(
      res,
      {
        status: "healthy",
        timestamp: new Date().toISOString()
      },
      200
    );
  }
}

export default new HealthController();
