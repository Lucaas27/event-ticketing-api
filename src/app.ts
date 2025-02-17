import { errorHandler, logger } from "@/middleware";
import healthRouter from "@/routes/healthRouter";
import cors from "cors";
import express, { NextFunction, Request, Response, type Application } from "express";

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
    this.app.use((req: Request, res: Response, next: NextFunction) => logger.handle(req, res, next));
  }

  private setupRoutes(): void {
    this.app.use("/", healthRouter.setupRoutes());
  }

  private setupErrorHandler(): void {
    this.app.use((err: Error, req: Request, res: Response) => errorHandler.handle(err, req, res));
  }
}

export default App;
