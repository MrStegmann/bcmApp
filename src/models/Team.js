export function TeamModel(dbInstance) {
  return {
    createTable: async () => {
      try {
        await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );`);
      } catch (error) {
        console.error(error);
        throw new Error("No se ha podido crear la tabla de Equipos");
      }
    },

    getAll: async (callback) => {
      try {
        callback(await dbInstance.getAllAsync(`SELECT * FROM teams;`));
      } catch (error) {
        console.log(error);
        callback([]);
      }
    },

    create: async (data) => {
      try {
        await dbInstance.runAsync("INSERT INTO teams (name) VALUES (?);", [
          data.name,
        ]);
      } catch (error) {
        console.error(error);
        throw new Error(
          `Ha ocurrido un error al intentar guardar ${data.name}`
        );
      }
    },
    update: async (data) => {
      try {
        await dbInstance.runAsync("UPDATE teams SET name = ? WHERE id = ?;", [
          data.name,
          data.id,
        ]);
      } catch (error) {
        console.error(error);
        throw new Error(
          `Ha ocurrido un error al intentar actualizar ${data.name}`
        );
      }
    },
    delete: async (id) => {
      try {
        await dbInstance.runAsync("DELETE FROM teams WHERE id = ?;", [id]);
      } catch (error) {
        console.error(error);
        throw new Error(`Ha ocurrido un error al intentar eliminar el equipo`);
      }
    },
  };
}
