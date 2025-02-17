import { EventModel } from "@/models/eventModel";
import { EventService } from "@/services/eventService";
import mongoose from "mongoose";

jest.mock("@/models/eventModel");

describe("EventService", () => {
  let eventService: EventService;

  beforeEach(() => {
    jest.clearAllMocks();
    eventService = new EventService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("addEvent", () => {
    test("should create a new event successfully", async () => {
      const eventData = {
        name: "New Event",
        date: new Date("2025-01-01"),
        capacity: 100,
        costPerTicket: 50
      };

      const expectedEvent = {
        ...eventData,
        _id: new mongoose.Types.ObjectId(),
        availableTickets: eventData.capacity,
        soldTickets: 0
      };

      // Mock the constructor and save method
      (EventModel as jest.MockedClass<typeof EventModel>).mockImplementation(
        () =>
          ({
            ...expectedEvent,
            save: jest.fn().mockResolvedValue(expectedEvent)
          }) as any
      );

      const result = await eventService.addEvent(eventData);

      expect(result).toMatchObject({
        name: eventData.name,
        capacity: eventData.capacity,
        availableTickets: eventData.capacity,
        soldTickets: 0
      });
      expect(EventModel).toHaveBeenCalledWith({
        ...eventData,
        availableTickets: eventData.capacity,
        soldTickets: 0
      });
    });
  });

  describe("processTicketTransaction", () => {
    test("should process ticket purchase successfully", async () => {
      const mockEvent = {
        _id: new mongoose.Types.ObjectId(),
        name: "Test Event",
        date: new Date("2025-01-01"),
        capacity: 100,
        costPerTicket: 50,
        availableTickets: 100,
        soldTickets: 0,
        save: jest.fn()
      };

      mockEvent.save.mockResolvedValue({
        ...mockEvent,
        availableTickets: 95,
        soldTickets: 5
      });

      jest.spyOn(EventModel, "findById").mockResolvedValueOnce(mockEvent);

      const result = await eventService.processTicketTransaction({
        eventId: mockEvent._id.toString(),
        nTickets: 5
      });

      expect(result.availableTickets).toBe(95);
      expect(result.soldTickets).toBe(5);
    });

    test("should throw error when not enough tickets", async () => {
      const mockEvent = {
        _id: new mongoose.Types.ObjectId(),
        name: "Test Event",
        date: new Date("2025-01-01"),
        capacity: 100,
        costPerTicket: 50,
        availableTickets: 100,
        soldTickets: 0
      };

      jest.spyOn(EventModel, "findById").mockResolvedValueOnce(mockEvent as any);

      await expect(
        eventService.processTicketTransaction({
          eventId: mockEvent._id.toString(),
          nTickets: 150
        })
      ).rejects.toThrow("Not enough tickets available");
    });
  });

  describe("getMonthlyStatistics", () => {
    test("should calculate statistics correctly", async () => {
      const mockEvents = [
        {
          date: new Date(),
          capacity: 100,
          availableTickets: 60,
          soldTickets: 40,
          costPerTicket: 50
        }
      ];

      jest.spyOn(EventModel, "find").mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockEvents)
      } as any);

      const stats = await eventService.getMonthlyStatistics();
      const currentMonth = stats.find(
        (s) => s.year === new Date().getFullYear() && s.month === new Date().getMonth() + 1
      );

      expect(currentMonth).toBeDefined();
      expect(currentMonth?.revenue).toBe(2000); // 40 tickets * $50
      expect(currentMonth?.nEvents).toBe(1);
      expect(currentMonth?.averageTicketsSold).toBe(40);
    });
  });
});
