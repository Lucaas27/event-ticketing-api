import Database from "@/database/mongo";
import Server from "@/server";
import { format } from "date-fns";
import request from "supertest";

describe("Complete Workflow", () => {
  let server: Server;
  let db: Database;

  beforeAll(async () => {
    server = new Server();
    db = new Database();
    await db.connect(process.env.MONGO_URL as string);
    await server.start(3300);
  });

  afterAll(async () => {
    await db.close();
    await server.stop();
  });

  test("should complete full event ticketing workflow", async () => {
    // Create event
    const createResponse = await request(server.appInstance.app)
      .post("/api/events")
      .send({
        name: "Test Event",
        date: format(new Date(), "dd/MM/yyyy"),
        capacity: 100,
        costPerTicket: 50
      })
      .expect(201);

    const eventId = createResponse.body.data.id;

    // Get event
    const getResponse = await request(server.appInstance.app).get(`/api/events/${eventId}`).expect(200);

    expect(getResponse.body.availableTickets).toBe(100);

    // Purchase tickets
    const purchaseResponse = await request(server.appInstance.app)
      .post("/api/events/purchase")
      .send({
        eventId,
        nTickets: 10
      })
      .expect(200);

    expect(purchaseResponse.body.data.remainingTickets).toBe(90);

    // Check stats
    const statsResponse = await request(server.appInstance.app).get("/api/events/stats").expect(200);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    interface MonthlyStats {
      month: number;
      year: number;
      revenue: number;
      nEvents: number;
      averageTicketsSold: number;
    }

    const monthStats = statsResponse.body.data.monthlyStats.find(
      (s: MonthlyStats) => s.month === currentMonth && s.year === currentYear
    );

    expect(monthStats).toBeDefined();
    expect(monthStats.revenue).toBe(500); // 10 tickets * $50
    expect(monthStats.nEvents).toBe(1);
    expect(monthStats.averageTicketsSold).toBe(10); // 10% sold
  });
});
