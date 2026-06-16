import { Object as BoardObject, Line } from "../types";

const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

const POSSESSION_THRESHOLD = 30;

export const calculateNextSceneObjects = (objects: BoardObject[], lines: Line[]): BoardObject[] => {
  const newObjects = objects.map(o => ({ ...o }));
  const lockedIds = new Set<string>();

  // Helper to find if a player has a ball
  const getBallForPlayer = (player: BoardObject) => {
    return newObjects.find(
      o => o.type === "ball" && distance(player, o) <= POSSESSION_THRESHOLD
    );
  };

  lines.forEach(line => {
    if (line.points.length < 2) return;
    const startPoint = line.points[0];
    const endPoint = line.points[line.points.length - 1];

    let closestObj: BoardObject | null = null;
    let minDistance = Infinity;

    if (line.type === "movement_line" || line.type === "screen_line") {
      // Find closest offensive or defensive player without a ball
      newObjects.forEach(obj => {
        if ((obj.type === "offensive" || obj.type === "defensive") && !lockedIds.has(obj.id)) {
          if (!getBallForPlayer(obj)) {
            const dist = distance(startPoint, obj);
            if (dist < minDistance) {
              minDistance = dist;
              closestObj = obj;
            }
          }
        }
      });

      if (closestObj) {
        (closestObj as BoardObject).x = endPoint.x;
        (closestObj as BoardObject).y = endPoint.y;
        lockedIds.add((closestObj as BoardObject).id);
      }
    } else if (line.type === "dribbling_line") {
      // Find closest offensive player WITH a ball
      newObjects.forEach(obj => {
        if (obj.type === "offensive" && !lockedIds.has(obj.id)) {
          if (getBallForPlayer(obj)) {
            const dist = distance(startPoint, obj);
            if (dist < minDistance) {
              minDistance = dist;
              closestObj = obj;
            }
          }
        }
      });

      if (closestObj) {
        const ball = getBallForPlayer(closestObj);
        if (ball && !lockedIds.has(ball.id)) {
          // Maintain relative offset for the ball
          const offsetX = ball.x - (closestObj as BoardObject).x;
          const offsetY = ball.y - (closestObj as BoardObject).y;
          ball.x = endPoint.x + offsetX;
          ball.y = endPoint.y + offsetY;
          lockedIds.add(ball.id);
        }
        (closestObj as BoardObject).x = endPoint.x;
        (closestObj as BoardObject).y = endPoint.y;
        lockedIds.add((closestObj as BoardObject).id);
      }
    } else if (line.type === "pass_line") {
      // Find closest ball
      newObjects.forEach(obj => {
        if (obj.type === "ball" && !lockedIds.has(obj.id)) {
          const dist = distance(startPoint, obj);
          if (dist < minDistance) {
            minDistance = dist;
            closestObj = obj;
          }
        }
      });

      if (closestObj) {
        (closestObj as BoardObject).x = endPoint.x;
        (closestObj as BoardObject).y = endPoint.y;
        lockedIds.add((closestObj as BoardObject).id);
      }
    }
  });

  // Assign new IDs to all objects to make them fresh copies
  return newObjects.map((obj, index) => ({
    ...obj,
    id: `${Date.now()}-${index}`
  }));
};
