import { errorHandler, logger } from "@/middleware";
import eventRouter from "@/routes/eventRouter";
import healthRouter from "@/routes/healthRouter";
import cors from "cors";
import express, { type Application } from "express";

class App {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(logger.handle.bind(logger));
  }

  private setupRoutes(): void {
    this.app.use("/", healthRouter.setupRoutes());
    this.app.use("/api/events", eventRouter.setupRoutes());
  }

  private setupErrorHandler(): void {
    this.app.use(errorHandler.handle.bind(errorHandler));
  }
}

export default App;
