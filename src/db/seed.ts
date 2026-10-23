import { seedDatabase, clearDatabase } from "../../scripts/seed-db";
import { validateDataset } from "./mock/mockDataValidator";
import { SeederServiceContract } from "../types/mockData";

export const seederService: SeederServiceContract = {
  clearDatabase,
  seedDatabase,
  validateDataset,
};

export { seedDatabase, clearDatabase, validateDataset };
export default seedDatabase;
