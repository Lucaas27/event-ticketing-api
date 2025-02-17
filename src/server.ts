import express, { type Application, type Request, type Response } from "express";
import { Server as HttpServer } from "http";

class Server {
  readonly app: Application;
  private static instance: Server;
  private httpServer?: HttpServer;

  private constructor() {
    this.app = express();
    this.initializeRoutes();
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  private initializeRoutes(): void {
    this.app.get("/", (_req: Request, res: Response) => {
      res.send("Hello World!");
    });
  }

  public start(port: number): void {
    this.httpServer = this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer?.close((err) => {
        if (err) {
          return reject(err);
        }
        console.log("Server has been stopped");
        resolve();
      });
    });
  }
}

export default Server;
