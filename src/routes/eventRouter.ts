import eventController from "@/controllers/eventController";
import { validateRequest } from "@/middleware";
import { IBaseRouter } from "@/types";
import { Router } from "express";
import { createEventDTO } from "../models/dtos/createEventDTO";

class EventRouter implements IBaseRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public setupRoutes(): Router {
    this.router.post("/", validateRequest.handle(createEventDTO), eventController.createEvent);
    return this.router;
  }
}

export default new EventRouter();
