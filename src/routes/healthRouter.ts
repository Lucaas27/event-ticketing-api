import healthController from "@/controllers/healthController";
import { IBaseRouter } from "@/types";
import { Router } from "express";

class HealthRouter implements IBaseRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public setupRoutes(): Router {
    this.router.get("/", healthController.getHealth);

    return this.router;
  }
}

export default new HealthRouter();
