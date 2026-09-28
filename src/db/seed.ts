import { db } from "./index";
import { teams, players, games, trainings, fees } from "./schema";
import { eq } from "drizzle-orm";

export async function seedDatabase(): Promise<{ teamId: number }> {
  // Check if a team already exists
  const existingTeams = await db.select().from(teams);
  if (existingTeams.length > 0) {
    return { teamId: existingTeams[0].id };
  }

  // 1. Seed Team
  const [team] = await db
    .insert(teams)
    .values({
      name: "Furola CB 25/26",
      category: "Senior Masculino",
    })
    .returning();

  const teamId = team.id;

  // 2. Seed Roster
  const initialPlayers = [
    { firstName: "Patrick", lastName: "Stegmann", number: "10", position: "Base" },
    { firstName: "Carlos", lastName: "León", number: "9", position: "Escolta" },
    { firstName: "Rau", lastName: "Gomez", number: "00", position: "Alero" },
    { firstName: "Juan Carlos", lastName: "El Xokas", number: "13", position: "Ala-Pívot" },
    { firstName: "Miguel", lastName: "Come Viejas", number: "69", position: "Pívot" },
    { firstName: "Sergio", lastName: "Vende Casas", number: "29", position: "Escolta" },
    { firstName: "Jugador", lastName: "Siete", number: "99", position: "Base" },
    { firstName: "Jugador", lastName: "Ocho", number: "98", position: "Alero" },
    { firstName: "Jugador", lastName: "Nueve", number: "97", position: "Pívot" },
    { firstName: "Jugador", lastName: "Diez", number: "96", position: "Ala-Pívot" },
    { firstName: "Jugador", lastName: "Once", number: "95", position: "Escolta" },
    { firstName: "Jugador", lastName: "Doce", number: "94", position: "Base" },
  ];

  for (const player of initialPlayers) {
    await db.insert(players).values({
      teamId,
      ...player,
    });
  }

  // 3. Seed Initial Game
  await db.insert(games).values({
    teamId,
    opponent: "Compactaciones",
    round: 1,
    date: "25/09/2025",
    resultC1: 15,
    resultC2: 13,
    resultC3: 15,
    resultC4: 10,
    resultExtra: 0,
    resultC1Opponent: 12,
    resultC2Opponent: 14,
    resultC3Opponent: 10,
    resultC4Opponent: 7,
    resultExtraOpponent: 0,
  });

  // 4. Seed Initial Training Session
  await db.insert(trainings).values({
    teamId,
    trainingNumber: 1,
    date: "24/09/2025",
    warmup1: "Rotación Articular",
    warmup1Explanation: "Movilidad articular general",
    warmup2: "Circuito defensivo",
    warmup2Explanation: "Circuito completo de desplazamientos",
    warmup3: "Trenza",
    warmup3Explanation: "Trenza de 3 balones",
    exercise1: "Ejercicio 1",
    exercise1Explanation: "Rueda de pases y tiro",
    exercise2: "Ejercicio 2",
    exercise2Explanation: "Transición 3v2 + 2v1",
    exercise3: "Ejercicio 3",
    exercise3Explanation: "Sistemas 5v5",
    exercise4: "Ejercicio 4",
    exercise4Explanation: "Tiro tras bote",
    exercise5: "Ejercicio 5",
    exercise5Explanation: "Tiros libres",
    exercise6: "Ejercicio 6",
    exercise6Explanation: "Estiramientos final",
    cooldown1: "Cooldown 1",
    cooldown1Explanation: "Estiramientos estáticos",
    cooldown2: "Cooldown 2",
    cooldown2Explanation: "Vuelta a la calma",
  });

  // 5. Seed Initial Fee
  await db.insert(fees).values({
    teamId,
    month: "Septiembre",
    year: 2025,
    amount: 30.0,
    paid: 1,
    dueDate: "30/09/2025",
  });

  return { teamId };
}
