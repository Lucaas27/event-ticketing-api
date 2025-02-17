import { CreateEventDTO } from "@/models/dtos/createEventDTO";
import { MonthlyStatisticsDTO } from "@/models/dtos/monthlyStatisticsDTO";
import { TicketTransactionDTO } from "@/models/dtos/ticketTransactionDTO";
import { EventModel, IEvent } from "@/models/eventModel";

export class EventService {
  async addEvent(eventData: CreateEventDTO): Promise<IEvent> {
    // Create and save the event
    const event = new EventModel({
      name: eventData.name,
      date: new Date(eventData.date), // Store as Date object
      capacity: eventData.capacity,
      costPerTicket: eventData.costPerTicket,
      availableTickets: eventData.capacity,
      soldTickets: 0
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

    if (event.availableTickets === 0) {
      throw new Error("Event is sold out");
    }

    if (event.availableTickets < requestedTickets) {
      throw new Error("Not enough tickets available");
    }
  }

  private async updateTicketAvailability(event: IEvent, ticketsToDeduct: number): Promise<IEvent> {
    event.availableTickets -= ticketsToDeduct;
    event.soldTickets = event.capacity - event.availableTickets; // Update soldTickets based on available

    // console.log("Updating ticket availability:", {
    //   eventId: event._id,
    //   ticketsToDeduct,
    //   newAvailable: event.availableTickets,
    //   newSoldTickets: event.soldTickets
    // });

    return await event.save();
  }

  public async getMonthlyStatistics(): Promise<MonthlyStatisticsDTO[]> {
    try {
      const today = new Date();
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(today.getMonth() - 12);

      // console.log("Query date range:", { start: twelveMonthsAgo, end: today });

      const events = await EventModel.find({
        date: {
          $gte: twelveMonthsAgo,
          $lte: today
        }
      }).lean();

      // console.log("Found events:", JSON.stringify(events, null, 2));

      const monthlyStats = new Map<string, MonthlyStatisticsDTO>();

      // Initialize all months with zero values
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthlyStats.set(key, {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          revenue: 0,
          nEvents: 0,
          averageTicketsSold: 0
        });
      }

      // Calculate statistics for each event
      events.forEach((event) => {
        const eventDate = new Date(event.date);
        const key = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1}`;

        // console.log("Processing event:", {
        //   name: event.name,
        //   date: eventDate,
        //   key,
        //   soldTickets: event.soldTickets,
        //   capacity: event.capacity,
        //   costPerTicket: event.costPerTicket
        // });

        const stats = monthlyStats.get(key);

        if (stats) {
          // Use soldTickets directly from the event
          const ticketsSoldPercentage = (event.soldTickets / event.capacity) * 100;
          const currentRevenue = event.soldTickets * event.costPerTicket;

          stats.nEvents++;
          stats.revenue += currentRevenue;

          // Update running average of tickets sold percentage
          const prevTotal = stats.averageTicketsSold * (stats.nEvents - 1);
          stats.averageTicketsSold = (prevTotal + ticketsSoldPercentage) / stats.nEvents;

          // console.log("Updated stats:", {
          //   key,
          //   soldTickets: event.soldTickets,
          //   ticketsSoldPercentage,
          //   currentRevenue,
          //   totalRevenue: stats.revenue,
          //   averageTicketsSold: stats.averageTicketsSold
          // });
        }
      });

      return Array.from(monthlyStats.values()).sort((a, b) => b.year - a.year || b.month - a.month);
    } catch (error) {
      // console.error("Error in getMonthlyStatistics:", error);
      throw new Error(
        "Failed to calculate monthly statistics: " + (error instanceof Error ? error.message : String(error))
      );
    }
  }
}
