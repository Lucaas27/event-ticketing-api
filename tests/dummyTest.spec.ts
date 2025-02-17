import Database from "@/database/mongo";
import { EventModel } from "@/models/eventModel";
import Server from "@/server";
import { format } from "date-fns";
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
    expect(response.body.status).toBe("healthy");
    expect(response.status).toBe(200);
  });

  test("mongo should create and retrieve an event from database", async () => {
    await EventModel.create({
      name: "Test",
      date: format(new Date(), "dd/MM/yyyy"),
      capacity: 1000,
      costPerTicket: 10
    });

    const result = await EventModel.findOne({ name: "Test" });

    expect(result?.name).toBe("Test");
  });
});
