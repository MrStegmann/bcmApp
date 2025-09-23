export class Team {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
  }
}

export function TeamModel(dbInstance) {
  return {
    createTable: async () => {
      try {
        await dbInstance.execAsync("DROP TABLE IF EXISTS teams;");
        await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );`);
      } catch (error) {
        console.log("Error al crear Teams: ", error);
      }
    },

    getAll: async (callback) => {
      try {
        callback(await dbInstance.getAllAsync(`SELECT * FROM teams;`));
      } catch (error) {
        console.log("Teams Get All:", error);
        callback([]);
      }
    },

    create: async (data) => {
      try {
        await dbInstance.runAsync("INSERT INTO teams (name) VALUES (?);", [
          data.name,
        ]);
      } catch (error) {
        console.error("Error al crear el club:", error);
      }
    },
    update: async (data) => {
      try {
        await dbInstance.runAsync("UPDATE teams SET name = ? WHERE id = ?;", [
          data.name,
          data.id,
        ]);
      } catch (error) {
        console.error(`Error al actualizar el equipo ${data.name}:`, error);
      }
    },
    delete: async (id) => {
      try {
        await dbInstance.runAsync("DELETE FROM teams WHERE id = ?;", [id]);
      } catch (error) {
        console.error(`Error al eliminar el club con ID ${id}:`, error);
      }
    },
  };
}
