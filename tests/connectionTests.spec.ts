import Database from "@/database/mongo";
import { EventModel } from "@/models/eventModel";
import Server from "@/server";
import { addDays } from "date-fns";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";

describe("Connection tests", () => {
  const server: Server = new Server();
  const db: Database = new Database();
  let request: TestAgent;

  beforeAll(async () => {
    server.start(3300);
    await db.connect(process.env.MONGO_URL as string);
    request = supertest(server.appInstance.app);
  });

  afterAll(async () => {
    await db.close();
    await server.stop();
  });

  test("server should return a healthy status", async () => {
    const response = await request.get("/");
    expect(response.body.data.status).toBe("healthy");
    expect(response.status).toBe(200);
  });

  test("mongo should create and retrieve an event from database", async () => {
    const tomorrow = addDays(new Date(), 1);
    const eventData = {
      name: "Test Event",
      date: tomorrow,
      capacity: 1000,
      costPerTicket: 10,
      availableTickets: 1000,
      soldTickets: 0
    };

    const createdEvent = await EventModel.create(eventData);
    const result = await EventModel.findOne({ _id: createdEvent._id });

    expect(result).toBeDefined();
    expect(result?.name).toBe(eventData.name);
    expect(result?.capacity).toBe(eventData.capacity);
    expect(result?.availableTickets).toBe(eventData.availableTickets);
    expect(new Date(result!.date).toISOString()).toBe(tomorrow.toISOString());
  });
});
