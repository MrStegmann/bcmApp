import { Team } from "../models/Team";
import { teamRepository } from "../db/TeamRepository";

export class TeamService {
  async getAllTeams(): Promise<Team[]> {
    return teamRepository.getAllTeams();
  }

  async getTeamById(id: string): Promise<Team | null> {
    return teamRepository.getTeamById(id);
  }

  async createTeam(team: Partial<Team>): Promise<Team> {
    return teamRepository.createTeam(team);
  }

  async updateTeam(id: string, teamData: Partial<Team>): Promise<Team> {
    const existingTeam = await teamRepository.getTeamById(id);
    if (!existingTeam) {
      throw new Error(`Team with id ${id} not found.`);
    }
    const updatedTeam = { ...existingTeam, ...teamData };
    return teamRepository.updateTeam(updatedTeam as Team);
  }

  async deleteTeam(id: string): Promise<void> {
    return teamRepository.deleteTeam(id);
  }
}

export const teamService = new TeamService();
