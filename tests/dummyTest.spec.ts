import Database from "@/database/mongo";
import { EventModel } from "@/models/eventModel";
import Server from "@/server";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";

describe("Dummy tests", () => {
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

  test("Express server", async () => {
    const response = await request.get("/");
    expect(response.body.status).toBe("healthy");
    expect(response.status).toBe(200);
  });

  test("Mongoose connection", async () => {
    await EventModel.create({
      title: "Test",
      description: "Test description",
      date: new Date(),
      price: 10,
      location: "Test location",
      capacity: 100,
      availableTickets: 100,
      isActive: true
    });

    const result = await EventModel.findOne({ title: "Test" });

    expect(result?.title).toBe("Test");
  });
});
