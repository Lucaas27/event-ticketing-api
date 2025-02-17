import App from "@/app";
import { Server as HttpServer } from "http";

class Server {
  public appInstance: App;
  private httpServer?: HttpServer;

  constructor() {
    this.appInstance = new App();
  }

  public async start(port: number): Promise<void> {
    this.httpServer = this.appInstance.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  public async stop(): Promise<void> {
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
