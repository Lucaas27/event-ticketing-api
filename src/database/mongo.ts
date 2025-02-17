import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";

class Database {
  private mongoServer?: MongoMemoryServer;
  public connection?: Connection;

  public async connect(uri?: string): Promise<void> {
    let mongoUri = uri;

    if (!mongoUri) {
      this.mongoServer = await MongoMemoryServer.create();
      mongoUri = this.mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    this.connection = mongoose.connection;
    console.log("Connected to MongoDB with Mongoose");
  }

  public async close(): Promise<void> {
    await mongoose.disconnect();
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
    console.log("Disconnected from MongoDB");
  }
}

export default Database;
