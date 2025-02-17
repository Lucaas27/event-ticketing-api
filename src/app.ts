import { errorHandler, logger } from "@/middleware";
import eventRouter from "@/routes/eventRouter";
import healthRouter from "@/routes/healthRouter";
import { ResponseHandler } from "@/utils/responseHandler";
import cors from "cors";
import express, { type Application, NextFunction, Request, Response } from "express";

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

    // Fallback for undefined routes
    this.app.use("*", (req: Request, res: Response) => {
      ResponseHandler.error(res, `Cannot ${req.method} ${req.originalUrl}`, 404, {
        availableEndpoints: ["/health", "/api/events"]
      });
    });
  }

  private setupErrorHandler(): void {
    // Important: Express requires all 4 parameters for error middleware
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      errorHandler.handle(err, req, res, next);
    });
  }
}

export default App;
