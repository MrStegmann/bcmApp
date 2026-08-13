import { AppDataSource } from "../utils/database";
import { Team } from "../models/Team";

export class TeamRepository {
  private repository = AppDataSource.getRepository(Team);

  async getAllTeams(): Promise<Team[]> {
    return this.repository.find({ order: { name: "ASC" } });
  }

  async getTeamById(id: string): Promise<Team | null> {
    return this.repository.findOne({ where: { id } });
  }

  async createTeam(team: Partial<Team>): Promise<Team> {
    const newTeam = this.repository.create(team);
    return this.repository.save(newTeam);
  }

  async updateTeam(team: Team): Promise<Team> {
    return this.repository.save(team);
  }

  async deleteTeam(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export const teamRepository = new TeamRepository();
