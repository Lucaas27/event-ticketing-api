import { CreateEventDTO } from "@/models/dtos/createEventDTO";
import { TicketTransactionDTO } from "@/models/dtos/ticketTransactionDTO";
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

  async processTicketTransaction(transactionData: TicketTransactionDTO): Promise<IEvent> {
    const event = await this.getEventById(transactionData.eventId);
    this.validateTicketTransaction(event, transactionData.nTickets);
    return this.updateTicketAvailability(event, transactionData.nTickets);
  }

  public async getEvents(): Promise<IEvent[]> {
    return await EventModel.find();
  }

  public async getEventById(eventId: string): Promise<IEvent> {
    const event = await EventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  private validateTicketTransaction(event: IEvent, requestedTickets: number): void {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      throw new Error("Event has already passed");
    }

    if (event.availableTickets === 0) {
      throw new Error("Event is sold out");
    }

    if (event.availableTickets < requestedTickets) {
      throw new Error("Not enough tickets available");
    }
  }

  private async updateTicketAvailability(event: IEvent, ticketsToDeduct: number): Promise<IEvent> {
    event.availableTickets -= ticketsToDeduct;
    return await event.save();
  }
}
