import Server from "@/server.js";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const server = Server.getInstance();

server.start(port);
