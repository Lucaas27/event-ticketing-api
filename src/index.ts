import Database from "@/database/mongo";
import Server from "@/server";
import dotenv from "dotenv";

dotenv.config();

async function main(): Promise<void> {
  const port = Number(process.env.PORT) || 3000;
  const db = new Database();
  const server = new Server();

  await db.connect();
  await server.start(port);
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});
