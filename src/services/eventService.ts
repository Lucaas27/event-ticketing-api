import { CreateEventDTO } from "@/models/dtos/createEventDTO";
import { EventModel, IEvent } from "@/models/eventModel";

export class EventService {
  async addEvent(eventData: CreateEventDTO): Promise<IEvent> {
    // Create and save the event
    const event = new EventModel({
      name: eventData.name,
      date: eventData.date,
      capacity: eventData.capacity,
      costPerTicket: eventData.costPerTicket,
      availableTickets: eventData.capacity
    });

    return await event.save();
  }
}
