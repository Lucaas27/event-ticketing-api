import { EventService } from "@/services/eventService";
import { Request, Response } from "express";

class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
    this.createEvent = this.createEvent.bind(this);
  }

  async createEvent(req: Request, res: Response) {
    try {
      const { name, date, capacity, costPerTicket } = req.body;

      // Parse date from DD/MM/YYYY format
      const [day, month, year] = date.split("/");
      const parsedDate = new Date(year, month - 1, day);

      const eventData = {
        name,
        date: parsedDate,
        capacity: Number(capacity),
        costPerTicket: Number(costPerTicket)
      };

      const newEvent = await this.eventService.addEvent(eventData);

      res.status(201).json({
        id: newEvent._id,
        message: "Event created successfully"
      });
    } catch (error) {
      if (error instanceof Error) {
        const mongoError = error as { code?: number };
        // MongoDB duplicate key error
        if (mongoError.code === 11000) {
          res.status(400).json({ error: "An event already exists on this date" });
        }
      }
    }
  }
}

export default new EventController();
