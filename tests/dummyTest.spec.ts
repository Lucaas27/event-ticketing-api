import { Db, MongoClient } from "mongodb";
import Server from "@/server";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";

describe("Dummy tests", () => {
  const server: Server = Server.getInstance();
  let mongoConn: MongoClient;
  let db: Db;
  let request: TestAgent;

  beforeAll(async () => {
    server.start(3300);
    mongoConn = await MongoClient.connect(process.env.MONGO_URL as string);
    db = mongoConn.db("jest");
    request = supertest(server.app);
  });

  afterAll(async () => {
    await mongoConn.close();
    await server.stop();
  });

  test("Express server", async () => {
    const response = await request.get("/");
    expect(response.text).toBe("Hello World!");
  });

  test("Mongo connection", async () => {
    const collection = db.collection("testCollection");

    await collection.insertOne({ test: "test" });
    const result = await collection.findOne({ test: "test" });

    expect(result?.test).toBe("test");
  });
});
