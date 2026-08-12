import { AppDataSource } from "./database";
import { Team } from "./Team";

export class TeamController {
  private teamRepository = AppDataSource.getRepository(Team);

  // GET Service Method
  async getTeams(): Promise<Team[]> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      return await this.teamRepository.find();
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      throw error;
    }
  }

  // SAVE Service Method
  async saveTeam(team: Team): Promise<Team> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      return await this.teamRepository.save(team);
    } catch (error) {
      console.error("Failed to save team:", error);
      throw error;
    }
  }

  // DELETE Service Method
  async deleteTeam(team: Team): Promise<Team> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      return await this.teamRepository.remove(team);
    } catch (error) {
      console.error("Failed to delete team:", error);
      throw error;
    }
  }
}