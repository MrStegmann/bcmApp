export function TeamModel(dbInstance) {
  return {
    createTable: async () => {
      try {
        await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            options TEXT DEFAULT 'showFees:true;',
            created_at TEXT DEFAULT (datetime('now'))
        );`);
      } catch (error) {
        console.error(error);
        throw new Error("No se ha podido crear la tabla de Equipos");
      }
    },

    get: async (id) => {
      const sqlStatment = id
        ? `SELECT * FROM teams WHERE id = ?`
        : `SELECT * FROM teams`;
      const params = id ? [id] : [];
      try {
        return await dbInstance.getAllAsync(sqlStatment, params);
      } catch (error) {
        console.error(error);
        throw new Error(
          `Ha ocurrido un error al intentar obtener todos los equipos`
        );
      }
    },
    save: async (data) => {
      const sqlStatment = data?.id
        ? `UPDATE teams SET name = ? WHERE id = ?;`
        : `INSERT INTO teams (name) VALUES (?);`;
      const params = data?.id ? [data.name, data.id] : [data.name];
      try {
        await dbInstance.runAsync(sqlStatment, params);
      } catch (error) {
        console.error(error);
        throw new Error(
          `Ha ocurrido un error al intentar guardar ${data.name}`
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
