import { create } from "zustand";
import TokenEnums from "../Enums/TokenEnums";
import { useAuthStore } from "./AuthStore";
import clientApi from "../helpers/ClientApi";

export const usePlaybookStore = create((set, get) => ({
  loading: false,

  activeTool: "",
  setActiveTool: (activeTool) => set({ activeTool }),

  halfCourt: true,
  setHalfCourt: (halfCourt) => set({ halfCourt }),

  selectedObject: null,
  setSelectedObject: (selectedObject) => set({ selectedObject }),

  fetchAll: async () => {
    set({ loading: true });

    const tokenFromStore = useAuthStore.getState().user?.token;

    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.get(`/playbooks`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  savePlaybook: async (data) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;

    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };

      await clientApi.post("/playbooks", data, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  deleteExercice: async (id) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      await clientApi.delete(`/playbooks/${id}`, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  setData: (data) => set({ data }),
  setStages: (stages) => set({ stages }),
  setObjectId: (objectId) => set({ objectId }),

  setObjectSelected: (objectSelected) => set({ objectSelected }),

  changeStage: (forward) => {
    const actualIndex = get().stageIndex;
    const newStages = [...get().stages];
    let newIndex = actualIndex;
    if (forward) {
      if (actualIndex + 1 > newStages.length - 1) return;
      newIndex += 1;
    } else {
      if (actualIndex - 1 < 0) return;
      newIndex -= 1;
    }
    set({
      stageIndex: newIndex,
      objectId: null,
      objectSelected: null,
    });
  },
  addStage: () => {
    const newStages = [...get().stages];
    const actualIndex = get().stageIndex;
    newStages.push([]);
    set({
      stages: newStages,
      stageIndex: actualIndex + 1,
      objectId: null,
      objectSelected: null,
    });
  },
  removeStage: () => {
    const actualIndex = get().stageIndex;
    const newStages = [...get().stages];
    let newIndex = actualIndex;
    if (newStages.length === 1) {
      return set({
        stages: [],
        stageIndex: 0,
        objectId: null,
        objectSelected: null,
      });
    }
    newStages.splice(actualIndex, 1);
    if (actualIndex - 1 >= 0) newIndex -= 1;
    set({
      stages: newStages,
      stageIndex: newIndex,
      objectId: null,
      objectSelected: null,
    });
  },

  addNewObject: (x, y) => {
    const objectType = get().objectSelected;
    if (
      [
        TokenEnums.RUNPATH,
        TokenEnums.PASSPATH,
        TokenEnums.DRIBBLINGPATH,
        TokenEnums.BLOCKPATH,
      ].includes(objectType) ||
      !objectType
    )
      return;
    const newStages = [...get().stages];
    const actualIndex = get().stageIndex;
    const newObjects = [...newStages[actualIndex]];
    newObjects.push({
      id: Date.now().toString(),
      type: objectType,
      x,
      y,
      label:
        objectType === TokenEnums.ATTACK || objectType === TokenEnums.DEFENSE
          ? newObjects.filter((o) => o.type === objectType).length + 1
          : null,
    });

    newStages[actualIndex] = newObjects;

    set({
      stages: newStages,
    });
  },
  addNewPathObject: (path) => {
    const newStages = [...get().stages];
    const actualIndex = get().stageIndex;
    const newObjects = [...newStages[actualIndex]];
    newObjects.push(path);

    newStages[actualIndex] = newObjects;
    set({
      stages: newStages,
    });
  },

  moveObject: (id, x, y) => {
    const newStages = [...get().stages];
    const actualIndex = get().stageIndex;
    const newObjects = newStages[actualIndex].map((obj) =>
      obj.id === id ? { ...obj, x, y } : obj,
    );

    newStages[actualIndex] = newObjects;
    set({
      stages: newStages,
    });
  },

  updatePathVertex: (lineId, vertexIndex, newX, newY) => {
    const newStages = [...get().stages];
    const actualIndex = get().stageIndex;
    const newObjects = newStages[actualIndex].map((obj) => {
      if (obj.id === lineId && obj.points) {
        const newPoints = [...obj.points];
        newPoints[vertexIndex] = { x: newX, y: newY };
        return { ...obj, points: newPoints };
      }
      return obj;
    });

    newStages[actualIndex] = newObjects;
    set({
      stages: newStages,
    });
  },

  deleteObject: () => {
    const newStages = [...get().stages];
    const actualIndex = get().stageIndex;
    const newObjects = newStages[actualIndex].filter(
      (obj) => obj.id !== get().objectId,
    );

    newStages[actualIndex] = newObjects;
    set({
      stages: newStages,
      objectId: null,
    });
  },

  clearObjects: () => {
    const newStages = [...get().stages];
    const actualIndex = get().stageIndex;

    newStages[actualIndex] = [];
    set({
      stages: newStages,
      objectId: null,
    });
  },

  pathRender: (points, courtSize, type) => {
    if (!points || points.length < 2) return "";

    if (type !== TokenEnums.DRIBBLINGPATH) {
      return points
        .map((p, i) => {
          const x = p.x * courtSize.width;
          const y = p.y * courtSize.height;
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
    }

    return get().dribblePathRender(points, courtSize);
  },
  dribblePathRender: (points, courtSize) => {
    if (!points || points.length < 2) return "";

    const width = courtSize.width;
    const height = courtSize.height;

    // Parámetros de estilo Playbook
    const zigzagSize = 5; // Qué tan ancha es la "Z"
    const stepSize = 7; // Distancia entre cada pico del zigzag

    let d = "";
    let lastX = points[0].x * width;
    let lastY = points[0].y * height;

    d = `M ${lastX} ${lastY}`;

    let accumulatedDist = 0;
    let side = 1; // Alterna entre 1 y -1 para el zigzag

    for (let i = 1; i < points.length - 1; i++) {
      const nextX = points[i].x * width;
      const nextY = points[i].y * height;

      const dx = nextX - lastX;
      const dy = nextY - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist === 0 || dist < 5) continue;

      accumulatedDist += dist;
      if (accumulatedDist >= stepSize) {
        const steps = Math.floor(accumulatedDist / stepSize);

        for (let s = 1; s <= steps; s++) {
          // Punto intermedio en la línea recta
          const ratio = (s * stepSize) / dist;
          const currX = lastX + dx * ratio;
          const currY = lastY + dy * ratio;

          // Vector perpendicular para el zigzag
          const nx = -dy / dist;
          const ny = dx / dist;

          // Generar el pico
          const zX = currX + nx * zigzagSize * side;
          const zY = currY + ny * zigzagSize * side;

          d += ` L ${zX} ${zY}`;
          side *= -1; // Cambiar de lado para el siguiente pico
        }

        lastX = nextX;
        lastY = nextY;
        accumulatedDist = 0;
      }
    }

    // Línea final hasta el último punto para que no quede incompleta
    d += ` L ${points[points.length - 1].x * width} ${points[points.length - 1].y * height}`;

    return d;
  },
}));
