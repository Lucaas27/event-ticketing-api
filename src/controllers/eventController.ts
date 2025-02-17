import { EventService } from "@/services/eventService";
import { ResponseHandler } from "@/utils/responseHandler";
import { Request, Response } from "express";

class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
    // Bind methods to preserve 'this' context
    this.createEvent = this.createEvent.bind(this);
    this.purchaseTickets = this.purchaseTickets.bind(this);
    this.getEventById = this.getEventById.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.getMonthlyStatistics = this.getMonthlyStatistics.bind(this);
  }

  async createEvent(req: Request, res: Response) {
    try {
      const { name, date, capacity, costPerTicket } = req.body;

      // Parse date from DD/MM/YYYY format
      const [day, month, year] = date.split("/");
      const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

      const eventData = {
        name,
        date: parsedDate,
        capacity: Number(capacity),
        costPerTicket: Number(costPerTicket)
      };

      const newEvent = await this.eventService.addEvent(eventData);

      ResponseHandler.success(
        res,
        {
          id: newEvent._id,
          message: "Event created successfully"
        },
        201
      );
    } catch (error) {
      if (error instanceof Error) {
        const mongoError = error as { code?: number };
        // MongoDB duplicate key error
        if (mongoError.code === 11000) {
          ResponseHandler.error(res, "An event already exists on this date", 400);
        } else {
          ResponseHandler.error(res, error.message);
        }
      }
    }
  }

  async purchaseTickets(req: Request, res: Response) {
    try {
      const result = await this.eventService.processTicketTransaction(req.body);
      ResponseHandler.success(res, {
        remainingTickets: result.availableTickets,
        message: "Ticket(s) purchased successfully"
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "Event not found":
            ResponseHandler.error(res, error.message, 404);
            break;
          case "Event is sold out":
          case "Not enough tickets available":
            ResponseHandler.error(res, error.message, 400);
            break;
          default:
            ResponseHandler.error(res, "Transaction failed", 500);
        }
      }
    }
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    const eventId = req.params.id;
    const event = await this.eventService.getEventById(eventId);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  }

  async getEvents(req: Request, res: Response): Promise<void> {
    const events = await this.eventService.getEvents();
    res.status(200).json(events);
  }

  async getMonthlyStatistics(req: Request, res: Response) {
    try {
      const statistics = await this.eventService.getMonthlyStatistics();
      ResponseHandler.success(res, {
        monthlyStats: statistics,
        totalMonths: statistics.length
      });
    } catch (error) {
      console.error("Statistics endpoint error:", error);
      ResponseHandler.error(res, error instanceof Error ? error.message : "Failed to retrieve statistics", 500);
    }
  }
}

export default new EventController();
