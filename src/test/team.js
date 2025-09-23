export async function createTeam(teamModel) {
  await teamModel.create({ name: "Furola CB 25/26" });
}
