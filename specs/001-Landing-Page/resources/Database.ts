import { DataSource } from "typeorm";
import { Team } from "./Team";

export const AppDataSource = new DataSource({
    type: "react-native",
    database: "app.db",
    location: "default",
    logging: true,
    synchronize: true, // Creates tables automatically (dev mode)
    entities: [Team],
});