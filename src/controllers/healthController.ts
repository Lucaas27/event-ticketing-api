import { Request, Response } from "express";

class HealthController {
  constructor() {}

  async getHealth(req: Request, res: Response) {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  }
}

export default new HealthController();
