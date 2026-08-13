import "reflect-metadata";
import { DataSource } from "typeorm";
import { Team } from "../models/Team";

export const AppDataSource = new DataSource({
  type: "react-native",
  database: "app.db",
  location: "default",
  synchronize: true, // Automatically creates/updates tables in dev mode
  logging: true,
  entities: [Team],  // Add all TypeORM models here
});

// Singleton initializer to prevent multi-connection race conditions
let isInitializing = false;

export const initializeDatabase = async (): Promise<DataSource> => {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  if (!isInitializing) {
    isInitializing = true;
    try {
      await AppDataSource.initialize();
      console.log("SQLite Database initialized successfully!");
    } catch (error) {
      console.error("Failed to initialize SQLite Database:", error);
      throw error;
    } finally {
      isInitializing = false;
    }
  }

  return AppDataSource;
};
