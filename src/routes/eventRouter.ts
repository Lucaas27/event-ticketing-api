import eventController from "@/controllers/eventController";
import { validateRequest } from "@/middleware";
import { IBaseRouter } from "@/types";
import { Router } from "express";
import { createEventDTO } from "../models/dtos/createEventDTO";
import { ticketTransactionDTO } from "../models/dtos/ticketTransactionDTO";

class EventRouter implements IBaseRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public setupRoutes(): Router {
    // POST endpoints
    this.router.post("/", validateRequest.handle(createEventDTO), eventController.createEvent);
    this.router.post("/purchase", validateRequest.handle(ticketTransactionDTO), eventController.purchaseTickets);

    // GET endpoints
    this.router.get("/", eventController.getEvents);
    this.router.get("/stats", eventController.getMonthlyStatistics);
    this.router.get("/:id", eventController.getEventById);

    return this.router;
  }
}

export default new EventRouter();
