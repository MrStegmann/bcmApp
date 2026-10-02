import { db } from "../src/db";
import {
  teams,
  players,
  games,
  playerStats,
  trainings,
  trainingPlayers,
} from "../src/db/schema";

/**
 * Clears all data from the database to guarantee a fresh start.
 */
export async function clearDatabase(): Promise<void> {
  console.log("🧹 Clearing database...");
  await db.delete(trainingPlayers);
  await db.delete(playerStats);
  await db.delete(trainings);
  await db.delete(games);
  await db.delete(players);
  await db.delete(teams);
  console.log("✅ Database cleared successfully.");
}

interface TeamSeedConfig {
  name: string;
  category: string;
  players: Array<{
    firstName: string;
    lastName: string;
    number: string;
    position: string;
    notes?: string;
  }>;
  games: Array<{
    opponent: string;
    round: number;
    date: string;
    scores: [number, number, number, number, number]; // C1, C2, C3, C4, Extra
    opponentScores: [number, number, number, number, number];
  }>;
  trainings: Array<{
    trainingNumber: number;
    date: string;
    warmup1: string;
    warmup1Explanation: string;
    warmup2: string;
    warmup2Explanation: string;
    warmup3: string;
    warmup3Explanation: string;
    exercise1: string;
    exercise1Explanation: string;
    exercise2: string;
    exercise2Explanation: string;
    exercise3: string;
    exercise3Explanation: string;
    exercise4: string;
    exercise4Explanation: string;
    exercise5: string;
    exercise5Explanation: string;
    exercise6: string;
    exercise6Explanation: string;
    cooldown1: string;
    cooldown1Explanation: string;
    cooldown2: string;
    cooldown2Explanation: string;
  }>;
}

const SEED_TEAMS_DATA: TeamSeedConfig[] = [
  // ==========================================
  // TEAM 1: Senior Masculino (10 Players, 7 Games, 10 Trainings)
  // ==========================================
  {
    name: "Furola Basket Club",
    category: "Senior Masculino",
    players: [
      { firstName: "Patrick", lastName: "Stegmann", number: "10", position: "Escolta", notes: "Especialista en triples y anotación exterior" },
      { firstName: "Carlos", lastName: "León", number: "9", position: "Base", notes: "Capitán del equipo, excelente control del ritmo" },
      { firstName: "Raúl", lastName: "Gómez", number: "00", position: "Alero", notes: "Penetrador potente y gran reboteador ofensivo" },
      { firstName: "Juan Carlos", lastName: "Morales", number: "13", position: "Ala-Pívot", notes: "Tiro de media distancia y juego al poste" },
      { firstName: "Miguel", lastName: "Fernández", number: "69", position: "Pívot", notes: "Presencia física en la pintura e intimidación" },
      { firstName: "Sergio", lastName: "Navarro", number: "23", position: "Escolta", notes: "Defensor perimetral y rapidez al contraataque" },
      { firstName: "Alejandro", lastName: "Sánchez", number: "7", position: "Base", notes: "Generador de juego y buen pasador" },
      { firstName: "Daniel", lastName: "Martín", number: "15", position: "Alero", notes: "Versátil en defensa y tiro desde la esquina" },
      { firstName: "Javier", lastName: "Ruiz", number: "33", position: "Ala-Pívot", notes: "Rebote y capacidad de pick & pop" },
      { firstName: "Roberto", lastName: "Díaz", number: "55", position: "Pívot", notes: "Efectivo finalizador cerca del aro" },
    ],
    games: [
      { opponent: "CB Joventut Badalona", round: 1, date: "05/10/2025", scores: [18, 16, 20, 22, 0], opponentScores: [14, 18, 15, 19, 0] },
      { opponent: "Bàsquet Manresa B", round: 2, date: "12/10/2025", scores: [22, 19, 14, 18, 0], opponentScores: [17, 21, 20, 16, 0] },
      { opponent: "CB L'Hospitalet", round: 3, date: "19/10/2025", scores: [15, 20, 24, 17, 0], opponentScores: [16, 15, 19, 21, 0] },
      { opponent: "CB Tarragona", round: 4, date: "26/10/2025", scores: [20, 15, 21, 25, 0], opponentScores: [18, 22, 16, 19, 0] },
      { opponent: "CB Santfeliuenc", round: 5, date: "02/11/2025", scores: [17, 18, 19, 16, 8], opponentScores: [19, 16, 18, 17, 6] },
      { opponent: "CB Cornellà", round: 6, date: "09/11/2025", scores: [21, 23, 18, 20, 0], opponentScores: [15, 19, 22, 18, 0] },
      { opponent: "Basquet Girona B", round: 7, date: "16/11/2025", scores: [19, 17, 22, 21, 0], opponentScores: [18, 20, 17, 23, 0] },
    ],
    trainings: [
      {
        trainingNumber: 1,
        date: "01/10/2025",
        warmup1: "Movilidad Articular",
        warmup1Explanation: "Movilidad dinámica de tobillos, rodillas y cadera",
        warmup2: "Trenza 3x0",
        warmup2Explanation: "Pases rápidos y finalización con bandeja",
        warmup3: "Juego de Pies",
        warmup3Explanation: "Paradas en 1 y 2 tiempos con fintas de salida",
        exercise1: "Rueda de Pases y Tiro",
        exercise1Explanation: "Recepción tras corte en V y tiro exterior",
        exercise2: "Transición 3v2 + 2v1",
        exercise2Explanation: "Lectura rápida de superioridades ofensivas",
        exercise3: "Espaciado Ofensivo 5x0",
        exercise3Explanation: "Instalación de sistema 'Cuernos' y 'Flare'",
        exercise4: "Defensa 1v1 Todo Campo",
        exercise4Explanation: "Negar el centro y contener penetración",
        exercise5: "Concurso de Triples",
        exercise5Explanation: "Tiros por parejas con 5 posiciones",
        exercise6: "Partido Condicionado 5x5",
        exercise6Explanation: "Canasta tras pase extra vale 3 puntos",
        cooldown1: "Tiros Libres de Concentración",
        cooldown1Explanation: "Meter 2 tiros libres seguidos por jugador",
        cooldown2: "Estiramientos Estáticos",
        cooldown2Explanation: "Estiramientos guiados de cadena posterior",
      },
      {
        trainingNumber: 2,
        date: "03/10/2025",
        warmup1: "Activación con Gomas",
        warmup1Explanation: "Fortalecimiento de glúteo medio y rotadores de hombro",
        warmup2: "Pilla-Pilla con Bote",
        warmup2Explanation: "Dominio de bote con mano no dominante y cambios de ritmo",
        warmup3: "Rueda de Entradas",
        warmup3Explanation: "Entradas a canasta a aro pasado y a pie cambiado",
        exercise1: "Pick & Roll Central 2v2",
        exercise1Explanation: "Defensa 'Flash' y ataque según el pase de salida",
        exercise2: "Pick & Roll Lateral 3v3",
        exercise2Explanation: "Ayuda del lado débil y rotación del alero",
        exercise3: "Tiro tras Bote Salida de Bloqueo",
        exercise3Explanation: "Salida de carretón y tiro a 6 metros",
        exercise4: "Defensa del Rebote 3v3",
        exercise4Explanation: "Cierre de rebote defensivo y salida rápida al contraataque",
        exercise5: "Llegadas 5v0 en Transición",
        exercise5Explanation: "Apertura a esquinas y trailer para tiro",
        exercise6: "5x5 Situaciones Finales",
        exercise6Explanation: "Última posesión con 14 segundos en el reloj",
        cooldown1: "Competición de Tiros Libres",
        cooldown1Explanation: "Rondas de muerte súbita",
        cooldown2: "Respiración y Relajación",
        cooldown2Explanation: "Ejercicios de respiración diafragmática tumbados",
      },
      {
        trainingNumber: 3,
        date: "08/10/2025",
        warmup1: "Skipping y Coordinación",
        warmup1Explanation: "Escalera de agilidad con apoyos laterales",
        warmup2: "Pase y Sigue en Tríos",
        warmup2Explanation: "Velocidad de pase y cambio de dirección",
        warmup3: "Finalizaciones con Contacto",
        warmup3Explanation: "Uso de protecciones en entradas hacia el aro",
        exercise1: "Salida de Presión 4v4",
        exercise1Explanation: "Estructura en rombo ante defensa 1-2-1-1",
        exercise2: "Tiro bajo Fatiga",
        exercise2Explanation: "Sprints a media pista y lanzamiento rápido",
        exercise3: "Ataque contra Zona 2-3",
        exercise3Explanation: "Balones al poste alto y pases 'High-Low'",
        exercise4: "Ataque contra Zona 3-2",
        exercise4Explanation: "Sobrecarga en lado fuerte y tiro de esquina",
        exercise5: "5v5 Continuo con Rebote",
        exercise5Explanation: "El que rebotea ataca al campo contrario inmediatamente",
        exercise6: "Táctica Específica Fin de Cuarto",
        exercise6Explanation: "Jugada de banda con bloqueo ciego para el pívot",
        cooldown1: "Tiros Libres en Parejas",
        cooldown1Explanation: "Anotar 10 tiros libres por pareja",
        cooldown2: "Descarga Muscular",
        cooldown2Explanation: "Uso de foam roller para piernas y espalda",
      },
      {
        trainingNumber: 4,
        date: "10/10/2025",
        warmup1: "Carrera Continua Progresiva",
        warmup1Explanation: "Desplazamientos adelante, atrás y defensivos",
        warmup2: "Manejo de 2 Balones",
        warmup2Explanation: "Bote simultáneo y alterno a diferentes alturas",
        warmup3: "Rueda de Tiros de 2",
        warmup3Explanation: "Parada y tiro desde 45 grados y cabecera",
        exercise1: "1v1 desde Cabecera",
        exercise1Explanation: "Máximo 3 botes para resolver la acción",
        exercise2: "2v2 con Bloqueo Indirecto",
        exercise2Explanation: "Lectura de rizo o apertura según la defensa",
        exercise3: "4v4 Defensa de Cambios",
        exercise3Explanation: "Comunicación defensiva en pantallas",
        exercise4: "Tiro por Posiciones Cronometrado",
        exercise4Explanation: "30 segundos por puesto con pasador activo",
        exercise5: "5x5 Media Pista",
        exercise5Explanation: "Cumplir al menos 3 pases antes del lanzamiento",
        exercise6: "5x5 Todo Campo",
        exercise6Explanation: "Juego real con arbitraje riguroso",
        cooldown1: "Serie de 50 Tiros Libres",
        cooldown1Explanation: "Anotar el 80% como objetivo grupal",
        cooldown2: "Estiramientos Suaves",
        cooldown2Explanation: "Flexibilidad de gemelos, isquios y cuádriceps",
      },
      {
        trainingNumber: 5,
        date: "15/10/2025",
        warmup1: "Juegos Recreativos",
        warmup1Explanation: "Balón prisionero con reglas de baloncesto",
        warmup2: "Coordinación Ojo-Mano",
        warmup2Explanation: "Pases con pelotas de tenis y balón de basket",
        warmup3: "Rueda de Triples",
        warmup3Explanation: "Tiro desde 5 posiciones perimetrales",
        exercise1: "Transición Ofensiva 4v3",
        exercise1Explanation: "Buscar el tiro librado en la esquina o penetración",
        exercise2: "Repliegue Defensivo 3v4",
        exercise2Explanation: "Proteger primero la pintura y luego el tiro exterior",
        exercise3: "Sistemas Ofensivos 5x0",
        exercise3Explanation: "Repaso de jugadas 'Box', 'Horns' y 'Flex'",
        exercise4: "Tiro tras Pantalla Directa",
        exercise4Explanation: "Pull-up jumper tras bloqueo del pívot",
        exercise5: "Juego Interior 2v2",
        exercise5Explanation: "Movimientos al poste bajo con fintas de tiro",
        exercise6: "5v5 con Bonus de Puntuación",
        exercise6Explanation: "Rebote ofensivo que acaba en canasta vale 4 puntos",
        cooldown1: "Tiros Libres Cruzados",
        cooldown1Explanation: "Lanzamientos desde dos canastas alternas",
        cooldown2: "Estiramientos Guiados",
        cooldown2Explanation: "Relajación muscular general",
      },
      {
        trainingNumber: 6,
        date: "17/10/2025",
        warmup1: "Movilidad con Pica",
        warmup1Explanation: "Apertura torácica y movilidad de hombros",
        warmup2: "Bote de Protección",
        warmup2Explanation: "Aguantar la presión defensiva con uso del cuerpo",
        warmup3: "Finalizaciones Float / 'Bomba'",
        warmup3Explanation: "Tiros flotantes sobre defensores altos",
        exercise1: "2v1 + 1 en Recuperación",
        exercise1Explanation: "Velocidad de decisión antes de que llegue la ayuda",
        exercise2: "3v3 con Poste Distribuidor",
        exercise2Explanation: "Pase al pívot y cortes de aleros por línea de fondo",
        exercise3: "Defensa Individual en Zonas de Ayuda",
        exercise3Explanation: "Posición defensiva a dos pases del balón",
        exercise4: "Concurso de Tiro de Media Distancia",
        exercise4Explanation: "Por equipos de 3 jugadores",
        exercise5: "5v5 Especial Saques de Fondo",
        exercise5Explanation: "Ejecución de jugadas ensayadas bajo canasta",
        exercise6: "5v5 Puntos por Posición",
        exercise6Explanation: "Canastas de bases valen doble",
        cooldown1: "Tiros Libres en Silencio",
        cooldown1Explanation: "Máxima concentración en técnica de tiro",
        cooldown2: "Respiraciones Guiadas",
        cooldown2Explanation: "Bajada de pulsaciones y feedback del entreno",
      },
      {
        trainingNumber: 7,
        date: "22/10/2025",
        warmup1: "Activación Dinámica",
        warmup1Explanation: "Zancadas, sentadillas y desplazamientos en zigzag",
        warmup2: "Rueda de Pases Rápidos",
        warmup2Explanation: "Pases de pecho y picados sin viajar con el balón",
        warmup3: "Entradas en Bandeja con Finta",
        warmup3Explanation: "Eurostep y paso atrás (stepback)",
        exercise1: "Pick & Pop 2v2",
        exercise1Explanation: "Apertura del 4 a la línea de 3 puntos",
        exercise2: "Defensa de Puerta Atrás 3v3",
        exercise2Explanation: "Negar líneas de pase sin ser superados por la espalda",
        exercise3: "Contraataque 5x0 con Tráiler",
        exercise3Explanation: "Salida del base, alas abiertas y llegada del pívot",
        exercise4: "Tiro desde las 5 Esquinas",
        exercise4Explanation: "Series de 10 lanzamientos consecutivos",
        exercise5: "5v5 Situaciones de 24 Segundos",
        exercise5Explanation: "Ataque con 8 segundos restantes de posesión",
        exercise6: "5v5 Todo Campo Competitivo",
        exercise6Explanation: "Partido a 15 puntos",
        cooldown1: "Tiro Libre Ganador",
        cooldown1Explanation: "El que falla hace flexiones ligeras",
        cooldown2: "Estiramientos de Espalda",
        cooldown2Explanation: "Descompresión lumbar y flexibilidad",
      },
      {
        trainingNumber: 8,
        date: "24/10/2025",
        warmup1: "Calentamiento Rítmico",
        warmup1Explanation: "Cambios de dirección y aceleraciones controladas",
        warmup2: "Dominio de Balón con Oposición",
        warmup2Explanation: "Bote entre conos con defensor empujando",
        warmup3: "Tiros de Media Distancia en Parada",
        warmup3Explanation: "Recepción en carrera y tiro equilibrado",
        exercise1: "1v1 en Poste Bajo",
        exercise1Explanation: "Gancho, semigancho y finta hacia el centro",
        exercise2: "3v3 Rotaciones Defensivas",
        exercise2Explanation: "Defender y rotar en ayudas escalonadas",
        exercise3: "Ataque de Bloqueo Ciego 4v4",
        exercise3Explanation: "Corte del tirador al centro de la zona",
        exercise4: "Tiro con Oposición Cercana",
        exercise4Explanation: "Tirar con mano del defensor en la cara",
        exercise5: "5v5 Presión Asfixiante",
        exercise5Explanation: "Defensa todo el campo tras cualquier canasta",
        exercise6: "5v5 Simulación de Partido",
        exercise6Explanation: "2 cuartos de 6 minutos a tiempo corrido",
        cooldown1: "Tiros Libres por Tríos",
        cooldown1Explanation: "20 tiros anotados por grupo",
        cooldown2: "Estiramientos Pasivos",
        cooldown2Explanation: "Relajación y estiramiento completo",
      },
      {
        trainingNumber: 9,
        date: "29/10/2025",
        warmup1: "Calentamiento Articular Suave",
        warmup1Explanation: "Rotaciones de tobillos, hombros y tronco",
        warmup2: "Circuito de Coordinación",
        warmup2Explanation: "Saltos con comba y ejercicios de pies",
        warmup3: "Rueda de Tiros Libres y Bandejas",
        warmup3Explanation: "Ritmo continuo sin bote",
        exercise1: "Transición Rápida 3v2",
        exercise1Explanation: "Búsqueda del hombre libre bajo aro",
        exercise2: "Defensa de Bloqueos Directos 'Drop'",
        exercise2Explanation: "Pívot contiene y recupera al tirador",
        exercise3: "Ataque a Zona 1-3-1",
        exercise3Explanation: "Pase a las esquinas y penetración por el fondo",
        exercise4: "Tiros de 3 Puntos en Transición",
        exercise4Explanation: "Parada en contragolpe y lanzamiento",
        exercise5: "5x5 Minipartido a 11 Puntos",
        exercise5Explanation: "Regla de posesión de 14 segundos",
        exercise6: "5x5 Jugada de Pizarra Final",
        exercise6Explanation: "Pizarra de entrenador con 3 segundos por jugar",
        cooldown1: "Tiros Libres de Cierre",
        cooldown1Explanation: "10 lanzamientos por jugador",
        cooldown2: "Estiramientos y Charla Táctica",
        cooldown2Explanation: "Análisis del entrenamiento y recuperación",
      },
      {
        trainingNumber: 10,
        date: "31/10/2025",
        warmup1: "Activación Cardiovascular",
        warmup1Explanation: "Trote con cambios de intensidad y sprint corto",
        warmup2: "Manejo de Balón en Espacio Reducido",
        warmup2Explanation: "Dribling protegiendo el balón en la botella",
        warmup3: "Rueda de Pases con Dos Balones",
        warmup3Explanation: "Pase picado simultáneo con pase de pecho",
        exercise1: "2v2 Pick & Roll en Esquina",
        exercise1Explanation: "Bloqueo 'Step Up' y pase de bolsillo al continuador",
        exercise2: "3v3 sin Bote",
        exercise2Explanation: "Movimiento constante sin balón para recibir abierto",
        exercise3: "Repaso Táctico 5x0",
        exercise3Explanation: "Ajuste de todas las jugadas de ataque y defensa",
        exercise4: "Concurso All-Star de Triples",
        exercise4Explanation: "Competición interna con ranking",
        exercise5: "5x5 Partido Real Pre-Competición",
        exercise5Explanation: "Ritmo alto y máxima concentración",
        exercise6: "Tiro Libre de Presión",
        exercise6Explanation: "Todos lanzan un tiro decisivo",
        cooldown1: "Tiros Libres Individuales",
        cooldown1Explanation: "Anotar 15 tiros libres antes de salir",
        cooldown2: "Estiramiento Completo y Vuelta a la Calma",
        cooldown2Explanation: "Estiramientos profundos de tren superior e inferior",
      },
    ],
  },

  // ==========================================
  // TEAM 2: Junior Masculino (12 Players, 7 Games, 10 Trainings)
  // ==========================================
  {
    name: "Danés Academy Basket",
    category: "Junior Masculino",
    players: [
      { firstName: "Marc", lastName: "Vidal", number: "4", position: "Base", notes: "Director de juego rápido e inteligente" },
      { firstName: "Lucas", lastName: "Romero", number: "8", position: "Escolta", notes: "Excelente anotador en transición" },
      { firstName: "Adrián", lastName: "Torres", number: "11", position: "Alero", notes: "Gran capacidad atlética y corte hacia el aro" },
      { firstName: "Pablo", lastName: "Moreno", number: "14", position: "Ala-Pívot", notes: "Reboteador versátil con tiro de 4 metros" },
      { firstName: "Hugo", lastName: "Serrano", number: "21", position: "Pívot", notes: "Gran altura y taponador nato" },
      { firstName: "Álvaro", lastName: "Ramos", number: "6", position: "Base", notes: "Defensor agresivo del base rival" },
      { firstName: "David", lastName: "Molina", number: "17", position: "Escolta", notes: "Tirador especialista desde las esquinas" },
      { firstName: "Mario", lastName: "Ortiz", number: "24", position: "Alero", notes: "Defensa multi-posicional muy intensa" },
      { firstName: "Jorge", lastName: "Gil", number: "30", position: "Ala-Pívot", notes: "Buen pasador desde poste alto" },
      { firstName: "Mateo", lastName: "Delgado", number: "35", position: "Pívot", notes: "Gran colocación en el rebote defensivo" },
      { firstName: "Iker", lastName: "Blanco", number: "5", position: "Base", notes: "Rápido en robo de balón y contragolpe" },
      { firstName: "Gonzalo", lastName: "Castro", number: "12", position: "Alero", notes: "Aporta intensidad y rebote largo" },
    ],
    games: [
      { opponent: "Valencia Basket Academy", round: 1, date: "04/10/2025", scores: [16, 18, 14, 20, 0], opponentScores: [15, 14, 19, 18, 0] },
      { opponent: "Real Canoe NC", round: 2, date: "11/10/2025", scores: [21, 15, 17, 22, 0], opponentScores: [18, 16, 20, 19, 0] },
      { opponent: "Estudiantes Madrid Jr", round: 3, date: "18/10/2025", scores: [14, 22, 19, 15, 0], opponentScores: [20, 18, 16, 17, 0] },
      { opponent: "Unicaja Málaga Jr", round: 4, date: "25/10/2025", scores: [19, 17, 23, 18, 0], opponentScores: [16, 19, 15, 20, 0] },
      { opponent: "CB Gran Canaria Jr", round: 5, date: "01/11/2025", scores: [23, 14, 18, 21, 0], opponentScores: [17, 20, 19, 18, 0] },
      { opponent: "Zaragoza Basket Jr", round: 6, date: "08/11/2025", scores: [18, 20, 15, 19, 0], opponentScores: [19, 17, 18, 16, 0] },
      { opponent: "UCAM Murcia Jr", round: 7, date: "15/11/2025", scores: [20, 16, 21, 24, 0], opponentScores: [15, 18, 20, 22, 0] },
    ],
    trainings: [
      {
        trainingNumber: 1,
        date: "02/10/2025",
        warmup1: "Calentamiento Dinámico",
        warmup1Explanation: "Carrera continua y movilidad de articulaciones",
        warmup2: "Manejo con Dos Balones",
        warmup2Explanation: "Bote simultáneo y cruzado en velocidad",
        warmup3: "Ruedas de Pase y Tiro",
        warmup3Explanation: "Pase picado con salida en parada en un tiempo",
        exercise1: "Lectura de Bloqueos 2v2",
        exercise1Explanation: "Ataque según la defensa del bloqueo directo",
        exercise2: "Transición Rápida 3v2",
        exercise2Explanation: "Buscar el tiro librado en menos de 6 segundos",
        exercise3: "Estructura Defensiva 4v4",
        exercise3Explanation: "Fijar ayudas y rotación de lado débil",
        exercise4: "Tiro tras Salida de Pantalla",
        exercise4Explanation: "Salida del escolta para tiro exterior",
        exercise5: "5v0 Ejecución Táctica",
        exercise5Explanation: "Repaso de jugadas principales de ataque",
        exercise6: "5v5 Partido a 12 Puntos",
        exercise6Explanation: "Partido condicionado con defensa zonal",
        cooldown1: "Tiros Libres en Parejas",
        cooldown1Explanation: "Series de 10 tiros libres consecutivos",
        cooldown2: "Estiramientos Guiados",
        cooldown2Explanation: "Estiramientos generales de tren inferior",
      },
      {
        trainingNumber: 2,
        date: "06/10/2025",
        warmup1: "Escalera de Coordinación",
        warmup1Explanation: "Pies rápidos y cambios de ritmo",
        warmup2: "Rueda de Contraataque 3x0",
        warmup2Explanation: "Pases sin botar hasta canasta",
        warmup3: "Entradas en Bandeja Complejas",
        warmup3Explanation: "Pérdida de paso y aro pasado",
        exercise1: "1v1 desde el Poste Medio",
        exercise1Explanation: "Uso de fintas y lanzamiento en suspensión",
        exercise2: "3v3 con Bloqueo Ciego",
        exercise2Explanation: "Corte hacia el aro y reemplazo exterior",
        exercise3: "Defensa Todo el Campo 1v1",
        exercise3Explanation: "Presión al manejador sin cometer falta",
        exercise4: "Concurso de Tiro de 3",
        exercise4Explanation: "5 posiciones alrededor del perímetro",
        exercise5: "5v5 con Situación de Rebote",
        exercise5Explanation: "Cierre de rebote estricto en cada posesión",
        exercise6: "5v5 Partido Libre",
        exercise6Explanation: "Juego continuo a 20 puntos",
        cooldown1: "Tiros Libres Consecutivos",
        cooldown1Explanation: "Anotar 2 tiros para finalizar",
        cooldown2: "Estiramientos en Suelo",
        cooldown2Explanation: "Trabajo de flexibilidad de cadera y lumbares",
      },
      {
        trainingNumber: 3,
        date: "09/10/2025",
        warmup1: "Activación Muscular",
        warmup1Explanation: "Ejercicios con bandas elásticas",
        warmup2: "Dribling con Oposición",
        warmup2Explanation: "Superar al defensor con bote de protección",
        warmup3: "Tiros de Media Distancia",
        warmup3Explanation: "Tiro tras parada en 2 tiempos",
        exercise1: "Pick & Roll en Transición",
        exercise1Explanation: "Bloqueo rápido en llegada al ataque",
        exercise2: "3v2 Continuo",
        exercise2Explanation: "Ejercicio de oleadas rápidas",
        exercise3: "Defensa de Líneas de Pase 4v4",
        exercise3Explanation: "Negar el pase al jugador adyacente",
        exercise4: "Tiro bajo Presión",
        exercise4Explanation: "Defensor salta a puntearle el tiro",
        exercise5: "5v0 Repaso de Zona",
        exercise5Explanation: "Movimiento de balón ante zona 2-3",
        exercise6: "5v5 Minipartido",
        exercise6Explanation: "Cuarto de 8 minutos con tiempo real",
        cooldown1: "Tiros Libres por Equipos",
        cooldown1Explanation: "Anotar 20 tiros colectivos",
        cooldown2: "Estiramientos de Isquiotibiales",
        cooldown2Explanation: "Flexibilidad guiada",
      },
      {
        trainingNumber: 4,
        date: "13/10/2025",
        warmup1: "Desplazamientos Defensivos",
        warmup1Explanation: "Pasos laterales con cambios de dirección",
        warmup2: "Rueda de Pases en Cuadrado",
        warmup2Explanation: "Pase tenso y recepción en movimiento",
        warmup3: "Finalizaciones a Tabla",
        warmup3Explanation: "Lanzamientos usando el tablero en ángulos difíciles",
        exercise1: "2v1 en Espacio Reducido",
        exercise1Explanation: "Ataque rápido cerca de la pintura",
        exercise2: "3v3 Corte UCLA",
        exercise2Explanation: "Bloqueo alto y corte del base al poste bajo",
        exercise3: "Defensa de Ayuda y Recuperación",
        exercise3Explanation: "Saltar a la ayuda y recuperar al tirador",
        exercise4: "Tiro tras Bloqueo Indirecto",
        exercise4Explanation: "Salida de bloqueo indirecto y tiro en suspensión",
        exercise5: "5v5 con Restricción de Bote",
        exercise5Explanation: "Máximo 2 botes por jugador",
        exercise6: "5v5 Juego Libre",
        exercise6Explanation: "Partido a ritmo alto",
        cooldown1: "Tiros Libres en Silencio",
        cooldown1Explanation: "Concentración en la rutina de tiro",
        cooldown2: "Estiramientos Generales",
        cooldown2Explanation: "Relajación muscular de piernas",
      },
      {
        trainingNumber: 5,
        date: "16/10/2025",
        warmup1: "Juegos con Balón",
        warmup1Explanation: "Juego de los 10 pases en espacio delimitado",
        warmup2: "Velocidad de Bote",
        warmup2Explanation: "Sprints botando con cambios de mano entre las piernas",
        warmup3: "Rueda de Tiros desde Cabecera",
        warmup3Explanation: "Tiros triples y de 2 largos",
        exercise1: "1v1 desde la Esquina",
        exercise1Explanation: "Penetración por línea de fondo o tiro",
        exercise2: "3v3 Juego por Conceptos",
        exercise2Explanation: "Pasar, cortar y reemplazar espacios vacíos",
        exercise3: "Defensa en Caja y Uno",
        exercise3Explanation: "Defensa individual al tirador y zona el resto",
        exercise4: "Tiro por Parejas",
        exercise4Explanation: "10 tiros desde 5 posiciones distintas",
        exercise5: "5v0 Situaciones Especiales",
        exercise5Explanation: "Saques de banda con 5 segundos de posesión",
        exercise6: "5v5 Competitivo",
        exercise6Explanation: "Partido con bonus en canastas de contraataque",
        cooldown1: "Tiros Libres Decisivos",
        cooldown1Explanation: "Lanzar bajo simulación de partido apretado",
        cooldown2: "Estiramientos y Feedback",
        cooldown2Explanation: "Repaso de aspectos tácticos",
      },
      {
        trainingNumber: 6,
        date: "20/10/2025",
        warmup1: "Movilidad Completa",
        warmup1Explanation: "Rotaciones y estiramientos dinámicos",
        warmup2: "Pase y Puerta Atrás",
        warmup2Explanation: "Engaño y pase picado a la espalda del defensor",
        warmup3: "Ruedas de Tiros en Espejo",
        warmup3Explanation: "Tiros sincronizados en dos canastas",
        exercise1: "2v2 Pick & Roll en Cabecera",
        exercise1Explanation: "Lectura del cambio defensivo",
        exercise2: "4v3 en Oleadas",
        exercise2Explanation: "Superioridad numérica con toma de decisión inmediata",
        exercise3: "Defensa de la Transición",
        exercise3Explanation: "Detener el avance del balón y proteger el aro",
        exercise4: "Tiro tras Bote de Escape",
        exercise4Explanation: "Bote hacia atrás para ganar espacio de tiro",
        exercise5: "5v5 Media Pista Defensiva",
        exercise5Explanation: "Obligar a agotar los 24 segundos de posesión",
        exercise6: "5v5 Partido a Campo Entero",
        exercise6Explanation: "Minipartido a 15 puntos",
        cooldown1: "Tiros Libres Continuos",
        cooldown1Explanation: "Meter 15 tiros libres antes de terminar",
        cooldown2: "Estiramientos de Espalda y Cuello",
        cooldown2Explanation: "Descompresión y respiración",
      },
      {
        trainingNumber: 7,
        date: "23/10/2025",
        warmup1: "Coordinación y Apoyos",
        warmup1Explanation: "Trabajo de apoyos y fintas sin balón",
        warmup2: "Manejo de Balón con Dos Manos",
        warmup2Explanation: "Botes bajos y cambios de mano por la espalda",
        warmup3: "Entradas en Bandeja con Oposición",
        warmup3Explanation: "Contacto físico en el salto hacia el aro",
        exercise1: "1v1 en Todo el Campo",
        exercise1Explanation: "Superar la presión individual en 8 segundos",
        exercise2: "3v3 con Poste Alto",
        exercise2Explanation: "Juego de pases interiores y cortes",
        exercise3: "Defensa Zonal 1-3-1",
        exercise3Explanation: "Desplazamientos y trampas en las esquinas",
        exercise4: "Competición de Triples por Equipos",
        exercise4Explanation: "Anotar 50 triples en el menor tiempo",
        exercise5: "5v0 Saques de Fondo y Banda",
        exercise5Explanation: "Automatización de jugadas de saque",
        exercise6: "5v5 Partido con Árbitro",
        exercise6Explanation: "Partido simulado con reglas oficiales",
        cooldown1: "Tiros Libres en Parejas",
        cooldown1Explanation: "Rondas de tiros libres alternos",
        cooldown2: "Estiramientos Guiados",
        cooldown2Explanation: "Flexibilidad general de piernas y brazos",
      },
      {
        trainingNumber: 8,
        date: "27/10/2025",
        warmup1: "Trote y Aceleraciones",
        warmup1Explanation: "Activación progresiva del ritmo cardíaco",
        warmup2: "Trenza de 5 Baloncesto",
        warmup2Explanation: "Pases rápidos a 5 bandas a lo largo del campo",
        warmup3: "Tiros de Media Distancia en Suspensión",
        warmup3Explanation: "Elevación y mecánica de tiro limpia",
        exercise1: "2v2 Bloqueo Ciego",
        exercise1Explanation: "Generar tiro abierto para el escolta",
        exercise2: "3v2 + 1 en Ayuda",
        exercise2Explanation: "Defensa en inferioridad con llegada del tercer defensor",
        exercise3: "Cierre de Rebote Colectivo",
        exercise3Explanation: "Bloquear a los 5 atacantes en cada tiro",
        exercise4: "Tiro desde la Esquina tras Penetración",
        exercise4Explanation: "Pase de 'Kick-out' para triple libre",
        exercise5: "5v5 Ataque contra Presión",
        exercise5Explanation: "Superar el 2x1 en medio campo",
        exercise6: "5v5 Minipartido a 10 Puntos",
        exercise6Explanation: "Juego rápido y fluido",
        cooldown1: "Tiros Libres de Concentración",
        cooldown1Explanation: "Anotar 2 tiros consecutivos",
        cooldown2: "Estiramientos en Suelo",
        cooldown2Explanation: "Trabajo de glúteo e isquiotibiales",
      },
      {
        trainingNumber: 9,
        date: "30/10/2025",
        warmup1: "Movilidad Articular Dinámica",
        warmup1Explanation: "Movilidad de tobillos y cadera",
        warmup2: "Bote Protegido y Pase de Bolos",
        warmup2Explanation: "Pase rápido raso con precisión",
        warmup3: "Ruedas de Tiros Triples",
        warmup3Explanation: "Lanzamientos desde los 5 ángulos",
        exercise1: "1v1 desde 45 Grados",
        exercise1Explanation: "Máximo 2 botes para definir",
        exercise2: "3v3 sin Dribling",
        exercise2Explanation: "Obligatorio desmarcarse y pasar rápido",
        exercise3: "Defensa de Cambios Automáticos",
        exercise3Explanation: "Ajuste tras bloqueo con comunicación",
        exercise4: "Tiro con Pasador en Carrera",
        exercise4Explanation: "Pase en transición y tiro rápido",
        exercise5: "5v0 Táctica Específica",
        exercise5Explanation: "Repaso final del sistema ofensivo",
        exercise6: "5v5 Partido Final",
        exercise6Explanation: "Partido de 10 minutos a tiempo corrido",
        cooldown1: "Tiros Libres en Grupo",
        cooldown1Explanation: "30 tiros libres anotados en total",
        cooldown2: "Estiramientos de Descarga",
        cooldown2Explanation: "Relajación muscular completa",
      },
      {
        trainingNumber: 10,
        date: "03/11/2025",
        warmup1: "Calentamiento General con Balón",
        warmup1Explanation: "Trote libre con cambios de ritmo y bote",
        warmup2: "Pilla-Pilla con Bote",
        warmup2Explanation: "Velocidad de reacción y reflejos",
        warmup3: "Rueda de Finalizaciones Variadas",
        warmup3Explanation: "Bandejas, mates y tiros a tabla",
        exercise1: "Pick & Roll 2v2 Central",
        exercise1Explanation: "Ajuste de pase corto al continuador",
        exercise2: "Transición 3v2 + 2v1",
        exercise2Explanation: "Lectura rápida del pase a la esquina",
        exercise3: "Defensa Zonal 2-3",
        exercise3Explanation: "Ajuste de líneas de pase y ayudas",
        exercise4: "Concurso de Tiro 'Knockout'",
        exercise4Explanation: "Juego de eliminatorias de tiro rápido",
        exercise5: "5v5 Simulación Final de Partido",
        exercise5Explanation: "Tanteo ajustado en los últimos 2 minutos",
        exercise6: "Tiro Libre de Oro",
        exercise6Explanation: "Lanzamiento decisivo individual",
        cooldown1: "Tiros Libres Individuales",
        cooldown1Explanation: "Anotar 10 tiros libres",
        cooldown2: "Estiramiento Final y Charla Técnica",
        cooldown2Explanation: "Conclusiones y preparación para la jornada",
      },
    ],
  },

  // ==========================================
  // TEAM 3: Cadete Masculino (14 Players, 7 Games, 10 Trainings)
  // ==========================================
  {
    name: "Canasta Real BCM",
    category: "Cadete Masculino",
    players: [
      { firstName: "Pau", lastName: "Soler", number: "3", position: "Base", notes: "Director de juego muy talentoso y pasador" },
      { firstName: "Biel", lastName: "Puig", number: "7", position: "Escolta", notes: "Anotador compulsivo y rápido al contraataque" },
      { firstName: "Arnau", lastName: "Font", number: "10", position: "Alero", notes: "Gran envergadura y buena defensa perimetral" },
      { firstName: "Nil", lastName: "Costa", number: "16", position: "Ala-Pívot", notes: "Reboteador incansable y tiro de media distancia" },
      { firstName: "Pol", lastName: "Mas", number: "25", position: "Pívot", notes: "Pívot dominante en la pintura y reboteador" },
      { firstName: "Gerard", lastName: "Roca", number: "1", position: "Base", notes: "Gran rapidez en el manejo de balón" },
      { firstName: "Oriol", lastName: "Serra", number: "18", position: "Escolta", notes: "Tirador de triples con buena mecánica" },
      { firstName: "Jan", lastName: "Bosch", number: "20", position: "Alero", notes: "Penetraciones agresivas hacia el aro" },
      { firstName: "Eric", lastName: "Martí", number: "22", position: "Ala-Pívot", notes: "Abre el campo con tiro exterior" },
      { firstName: "Aleix", lastName: "Valls", number: "34", position: "Pívot", notes: "Intimidador defensivo bajo canasta" },
      { firstName: "Guillem", lastName: "Roig", number: "2", position: "Base", notes: "Presión a toda pista al base rival" },
      { firstName: "Jordi", lastName: "Farré", number: "19", position: "Escolta", notes: "Excelente defensor de balón" },
      { firstName: "Martí", lastName: "Pons", number: "28", position: "Alero", notes: "Aporta energía y rebote en ambos aros" },
      { firstName: "Roger", lastName: "Cruz", number: "44", position: "Pívot", notes: "Fuerte juego de espaldas al aro" },
    ],
    games: [
      { opponent: "FC Barcelona Cadete", round: 1, date: "03/10/2025", scores: [12, 16, 18, 14, 0], opponentScores: [15, 14, 16, 17, 0] },
      { opponent: "Real Madrid Cadete B", round: 2, date: "10/10/2025", scores: [18, 20, 15, 17, 0], opponentScores: [16, 18, 19, 15, 0] },
      { opponent: "CB Sant Josep Badalona", round: 3, date: "17/10/2025", scores: [15, 18, 22, 16, 0], opponentScores: [14, 17, 18, 19, 0] },
      { opponent: "CB Mataró Cadete", round: 4, date: "24/10/2025", scores: [20, 14, 19, 21, 0], opponentScores: [17, 19, 16, 18, 0] },
      { opponent: "SESE Bàsquet", round: 5, date: "31/10/2025", scores: [16, 21, 17, 19, 0], opponentScores: [15, 18, 20, 16, 0] },
      { opponent: "CB Granollers Cadete", round: 6, date: "07/11/2025", scores: [19, 16, 20, 18, 0], opponentScores: [18, 17, 19, 21, 0] },
      { opponent: "Bàsquet Manresa Cadete", round: 7, date: "14/11/2025", scores: [22, 18, 16, 20, 0], opponentScores: [19, 15, 17, 18, 0] },
    ],
    trainings: [
      {
        trainingNumber: 1,
        date: "01/10/2025",
        warmup1: "Juego del Comecocos con Bote",
        warmup1Explanation: "Bote sobre las líneas de la pista sin cruzarse",
        warmup2: "Pase en Parejas en Carrera",
        warmup2Explanation: "Pases tensos cruzando la pista sin bote",
        warmup3: "Rueda de Bandejas por la Derecha e Izquierda",
        warmup3Explanation: "Finalizaciones con mano dominante y no dominante",
        exercise1: "Fundamentos de Bote 1v1",
        exercise1Explanation: "Cambios por delante, entre piernas y espalda",
        exercise2: "Pase y Corte al Aro 2v0",
        exercise2Explanation: "Corte 'Give and Go' con pase picado",
        exercise3: "Defensa Básica del 1v1",
        exercise3Explanation: "Posición básica defensiva y desplazamiento lateral",
        exercise4: "Rueda de Tiros desde el Tiro Libre",
        exercise4Explanation: "Mecánica limpia de tiro a 4 metros",
        exercise5: "3v3 en Media Pista",
        exercise5Explanation: "Juego libre con 3 pases mínimos",
        exercise6: "5v5 Partido Formativo",
        exercise6Explanation: "Partido aplicando los conceptos aprendidos",
        cooldown1: "Tiros Libres por Turnos",
        cooldown1Explanation: "Anotar 1 tiro libre cada uno",
        cooldown2: "Estiramientos Suaves",
        cooldown2Explanation: "Estiramientos generales de piernas y espalda",
      },
      {
        trainingNumber: 2,
        date: "05/10/2025",
        warmup1: "Circuito de Coordinación",
        warmup1Explanation: "Aros y conos para saltos y cambios de dirección",
        warmup2: "Bote con Pelota de Tenis",
        warmup2Explanation: "Lanzar pelota de tenis mientras se bota con la otra mano",
        warmup3: "Rueda de Entradas a Canasta",
        warmup3Explanation: "Parada en dos tiempos y tiro corto a tabla",
        exercise1: "2v1 de Contraataque",
        exercise1Explanation: "Fijar al único defensor y pase al jugador libre",
        exercise2: "3v3 con Espaciado",
        exercise2Explanation: "Mantener 4 metros de separación entre atacantes",
        exercise3: "Defensa del Jugador sin Balón",
        exercise3Explanation: "Triángulo defensivo: ver al atacante y al balón",
        exercise4: "Concurso de Tiros de 2",
        exercise4Explanation: "Competición de tiro desde las alas",
        exercise5: "4v4 Juego Continuo",
        exercise5Explanation: "Ataque rápido tras rebote defensivo",
        exercise6: "5v5 Partido a Campo Completo",
        exercise6Explanation: "Juego fluido de 10 minutos",
        cooldown1: "Tiros Libres en Parejas",
        cooldown1Explanation: "Anotar 8 tiros por pareja",
        cooldown2: "Estiramientos de Isquios",
        cooldown2Explanation: "Flexibilidad de piernas guiada",
      },
      {
        trainingNumber: 3,
        date: "08/10/2025",
        warmup1: "Trote y Movilidad Articular",
        warmup1Explanation: "Calentamiento articular completo",
        warmup2: "Pases Rápidos en Triángulo",
        warmup2Explanation: "Pase de pecho en triángulo con 2 balones",
        warmup3: "Entradas con Finta de Salida",
        warmup3Explanation: "Finta con la cabeza y salida explosiva",
        exercise1: "1v1 en el Poste Alto",
        exercise1Explanation: "Finta de tiro y penetración directa al aro",
        exercise2: "2v2 con Bloqueo Directo",
        exercise2Explanation: "Iniciación al bloqueo y continuación (Pick & Roll)",
        exercise3: "Defensa en Línea de Pase",
        exercise3Explanation: "Meter la mano en la trayectoria del pase",
        exercise4: "Tiro tras Rebote Ofensivo",
        exercise4Explanation: "Subir con fuerza sin bajar el balón al pecho",
        exercise5: "4v4 Media Pista con Normas",
        exercise5Explanation: "Prohibido botar en campo propio",
        exercise6: "5v5 Minipartido Formativo",
        exercise6Explanation: "Partido a 15 puntos",
        cooldown1: "Tiros Libres de Concentración",
        cooldown1Explanation: "Tiro libre con técnica correcta",
        cooldown2: "Estiramientos en el Suelo",
        cooldown2Explanation: "Relajación y respiración",
      },
      {
        trainingNumber: 4,
        date: "12/10/2025",
        warmup1: "Juego de la Cadena con Bote",
        warmup1Explanation: "Velocidad y habilidad de escape",
        warmup2: "Dominio de Balón Alto y Bajo",
        warmup2Explanation: "Bote de poder a la altura del hombro y tobillo",
        warmup3: "Rueda de Tiros desde la Bombilla",
        warmup3Explanation: "Lanzamientos desde cabecera de la zona",
        exercise1: "3v2 en Llegada Rápida",
        exercise1Explanation: "Ataque rápido buscando el pase extra",
        exercise2: "1v1 Todo el Campo",
        exercise2Explanation: "Superar al defensor en carrera continua",
        exercise3: "Defensa del Bloqueo Directo",
        exercise3Explanation: "Pasar el bloqueo por detrás o por arriba",
        exercise4: "Tiro por Equipos con Reboteador",
        exercise4Explanation: "Series de 20 tiros anotados",
        exercise5: "5v5 sin Balón Parado",
        exercise5Explanation: "Juego sin interrupciones",
        exercise6: "5v5 Situaciones de 10 Segundos",
        exercise6Explanation: "Ataques rápidos al límite del tiempo",
        cooldown1: "Tiros Libres Cruzados",
        cooldown1Explanation: "Lanzar en ambas canastas",
        cooldown2: "Estiramientos Generales",
        cooldown2Explanation: "Flexibilidad de piernas y brazos",
      },
      {
        trainingNumber: 5,
        date: "15/10/2025",
        warmup1: "Carrera y Saltos de Coordinación",
        warmup1Explanation: "Saltos a pies juntos y a la pata coja",
        warmup2: "Trenza Básica de 3 Jugadores",
        warmup2Explanation: "Pases fluidos sin viajar",
        warmup3: "Finalizaciones a Aro Pasado",
        warmup3Explanation: "Uso del tablero por el lado contrario",
        exercise1: "2v2 con Corte por Fondo",
        exercise1Explanation: "Aprovechar la espalda del defensor despistado",
        exercise2: "3v3 en Superioridad Rápida",
        exercise2Explanation: "Toma de decisión de tiro o pase",
        exercise3: "Defensa de la Puerta Atrás",
        exercise3Explanation: "Girar el cuerpo y cortar la trayectoria",
        exercise4: "Concurso de Tiros de 3",
        exercise4Explanation: "Primeros lanzamientos triples en edad cadete",
        exercise5: "5v0 Movimiento de Ataque",
        exercise5Explanation: "Automatismo del sistema básico 5 abierto",
        exercise6: "5v5 Partido Intenso",
        exercise6Explanation: "Partido a 20 puntos con cambios continuos",
        cooldown1: "Tiros Libres por Parejas",
        cooldown1Explanation: "Anotar 10 tiros cada pareja",
        cooldown2: "Estiramientos de Espalda",
        cooldown2Explanation: "Descompresión lumbar",
      },
      {
        trainingNumber: 6,
        date: "19/10/2025",
        warmup1: "Activación Dinámica en Círculo",
        warmup1Explanation: "Movilidad de hombros y piernas",
        warmup2: "Pilla-Pilla por Parejas con Bote",
        warmup2Explanation: "Trabajo en parejas sin perder el balón",
        warmup3: "Rueda de Tiros Cortos a 45 Grados",
        warmup3Explanation: "Parada y tiro con tablero",
        exercise1: "1v1 desde la Línea de Fondo",
        exercise1Explanation: "Desmarcarse y atacar el aro",
        exercise2: "3v3 con Poste Distribuidor",
        exercise2Explanation: "Pases al interior y cortes coordinados",
        exercise3: "Ayudas y Recuperaciones Defensivas",
        exercise3Explanation: "Hacer la finta de ayuda ('stunt') y volver",
        exercise4: "Tiro con Pasador en Movimiento",
        exercise4Explanation: "Recepción en carrera y tiro rápido",
        exercise5: "4v4 Todo Campo con Presión",
        exercise5Explanation: "Aprender a salir de la presión colectiva",
        exercise6: "5v5 Minipartido",
        exercise6Explanation: "Juego real con aplicación de reglas",
        cooldown1: "Tiros Libres en Silencio",
        cooldown1Explanation: "Máxima calma y respiración",
        cooldown2: "Estiramientos de Piernas",
        cooldown2Explanation: "Flexibilidad de gemelos y cuádriceps",
      },
      {
        trainingNumber: 7,
        date: "22/10/2025",
        warmup1: "Juego de Relevos con Balón",
        warmup1Explanation: "Velocidad de carrera botando en zigzag",
        warmup2: "Pases de Béisbol y Pecho",
        warmup2Explanation: "Pases largos precisos de contraataque",
        warmup3: "Entradas en Suspensión",
        warmup3Explanation: "Salto vertical y tiro en el punto más alto",
        exercise1: "2v1 en Contraataque Rápido",
        exercise1Explanation: "Finalizar en menos de 4 segundos",
        exercise2: "3v3 con Bloqueo Indirecto",
        exercise2Explanation: "Salida para tiro exterior tras pantalla",
        exercise3: "Cierre de Rebote y Salida Rápida",
        exercise3Explanation: "Pase de apertura al base en carrera",
        exercise4: "Competición de Tiros de 2",
        exercise4Explanation: "Rondas de 15 lanzamientos",
        exercise5: "5v0 Saques de Fondo",
        exercise5Explanation: "Jugada ensayada para canasta fácil",
        exercise6: "5v5 Partido a Campo Completo",
        exercise6Explanation: "Minipartido a 12 puntos",
        cooldown1: "Tiros Libres por Grupos",
        cooldown1Explanation: "Anotar 15 tiros libres por grupo",
        cooldown2: "Estiramientos Guiados",
        cooldown2Explanation: "Relajación completa",
      },
      {
        trainingNumber: 8,
        date: "26/10/2025",
        warmup1: "Movilidad Articular y Skipping",
        warmup1Explanation: "Coordinación de carrera y zancada",
        warmup2: "Bote entre las Piernas en Movimiento",
        warmup2Explanation: "Cambios continuos de mano",
        warmup3: "Rueda de Bandejas con Resistencia",
        warmup3Explanation: "Superar el contacto físico del entrenador",
        exercise1: "1v1 en la Cabecera",
        exercise1Explanation: "Atacar el pie adelantado del defensor",
        exercise2: "3v2 en Oleadas Continuas",
        exercise2Explanation: "Ritmo vertiginoso de ataque y repliegue",
        exercise3: "Defensa Zonal 3-2 Iniciación",
        exercise3Explanation: "Conceptos básicos de cobertura zonal",
        exercise4: "Tiro tras Bote de Penetración",
        exercise4Explanation: "Parada en 1 tiempo a 5 metros",
        exercise5: "5v5 con Tiempo de Posesión Reducido",
        exercise5Explanation: "14 segundos para tirar a canasta",
        exercise6: "5v5 Partido Libre",
        exercise6Explanation: "Juego libre competitivo",
        cooldown1: "Tiros Libres Individuales",
        cooldown1Explanation: "Anotar 2 de 2 tiros libres",
        cooldown2: "Estiramientos de Cadena Posterior",
        cooldown2Explanation: "Flexibilidad de glúteo e isquios",
      },
      {
        trainingNumber: 9,
        date: "29/10/2025",
        warmup1: "Juego de Calentamiento Lúdico",
        warmup1Explanation: "Relevos de habilidad y manejo",
        warmup2: "Pase y Desmarque en Espacio Reducido",
        warmup2Explanation: "Crear espacio con el cuerpo para recibir",
        warmup3: "Rueda de Tiros desde las Esquinas",
        warmup3Explanation: "Lanzamientos exteriores",
        exercise1: "2v2 Pick & Roll en el Eje",
        exercise1Explanation: "Pase rápido al pívot tras la continuación",
        exercise2: "4v3 en Superioridad Numérica",
        exercise2Explanation: "Hacer circular el balón hasta encontrar al hombre libre",
        exercise3: "Defensa Agresiva de Balón",
        exercise3Explanation: "Presionar al que bota sin perder la posición",
        exercise4: "Concurso All-Star Cadete",
        exercise4Explanation: "Competición de habilidades y tiro",
        exercise5: "5v0 Repaso Táctico General",
        exercise5Explanation: "Sistemas de juego y saques",
        exercise6: "5v5 Partido a 15 Puntos",
        exercise6Explanation: "Gran intensidad formativa",
        cooldown1: "Tiros Libres en Silencio",
        cooldown1Explanation: "Concentración en la rutina",
        cooldown2: "Estiramientos y Puntos Clave",
        cooldown2Explanation: "Repaso de la sesión",
      },
      {
        trainingNumber: 10,
        date: "02/11/2025",
        warmup1: "Calentamiento Progresivo",
        warmup1Explanation: "Trote, zancadas, saltos y desplazamientos",
        warmup2: "Manejo Integral de Balón",
        warmup2Explanation: "Bote cruzado, reverso y cambios de ritmo",
        warmup3: "Finalizaciones con Mate / Aro Pasado",
        warmup3Explanation: "Motivación y técnica de salto hacia el aro",
        exercise1: "Pick & Roll 3v3 con Ayuda",
        exercise1Explanation: "Lectura defensiva completa",
        exercise2: "Transición 5v4 en Superioridad",
        exercise2Explanation: "Ataque veloz antes de que llegue el 5º defensor",
        exercise3: "Defensa 5v5 Todo Campo",
        exercise3Explanation: "Presión individual tras canasta",
        exercise4: "Tiro Decisivo de Fin de Posesión",
        exercise4Explanation: "Tiro con cuenta atrás de 3 segundos",
        exercise5: "5v5 Simulación de Partido Real",
        exercise5Explanation: "2 cuartos de 5 minutos cronometrados",
        exercise6: "Tiro Libre de Campeonato",
        exercise6Explanation: "Competición eliminatoria",
        cooldown1: "Tiros Libres Colectivos",
        cooldown1Explanation: "Anotar 25 tiros libres grupales",
        cooldown2: "Estiramiento Completo y Reflexión",
        cooldown2Explanation: "Estiramientos guiados y cierre de la semana",
      },
    ],
  },
];

/**
 * Main database seed function.
 * Clears all existing tables and populates with realistic, comprehensive basketball data.
 */
export async function seedDatabase(): Promise<{
  teamsCount: number;
  playersCount: number;
  gamesCount: number;
  trainingsCount: number;
}> {
  console.log("🌱 Starting full database seed...");

  // 1. Clear existing database
  await clearDatabase();

  let totalPlayersCount = 0;
  let totalGamesCount = 0;
  let totalTrainingsCount = 0;

  // 2. Iterate through each team config and insert data
  for (const teamConfig of SEED_TEAMS_DATA) {
    // 2.1 Insert Team
    const [insertedTeam] = await db
      .insert(teams)
      .values({
        name: teamConfig.name,
        category: teamConfig.category,
      })
      .returning();

    const teamId = insertedTeam.id;
    console.log(`🏀 Created team #${teamId}: "${teamConfig.name}" (${teamConfig.category})`);

    // 2.2 Insert Players
    const insertedPlayers = [];
    for (const p of teamConfig.players) {
      const [player] = await db
        .insert(players)
        .values({
          teamId,
          firstName: p.firstName,
          lastName: p.lastName,
          number: p.number,
          position: p.position,
          notes: p.notes,
        })
        .returning();
      insertedPlayers.push(player);
      totalPlayersCount++;
    }
    console.log(`   👥 Inserted ${insertedPlayers.length} players.`);

    // 2.3 Insert Games and realistic Player Stats
    for (const g of teamConfig.games) {
      const [game] = await db
        .insert(games)
        .values({
          teamId,
          opponent: g.opponent,
          round: String(g.round),
          date: g.date,
          resultC1: g.scores[0],
          resultC2: g.scores[1],
          resultC3: g.scores[2],
          resultC4: g.scores[3],
          resultExtra: g.scores[4],
          resultC1Opponent: g.opponentScores[0],
          resultC2Opponent: g.opponentScores[1],
          resultC3Opponent: g.opponentScores[2],
          resultC4Opponent: g.opponentScores[3],
          resultExtraOpponent: g.opponentScores[4],
        })
        .returning();

      totalGamesCount++;

      // Distribute realistic minutes and stats among players on the team
      for (let i = 0; i < insertedPlayers.length; i++) {
        const player = insertedPlayers[i];
        // Starters (first 5) get more minutes, bench gets rotation minutes
        const isStarter = i < 5;
        const minutes = isStarter ? 20 + ((i * 3 + g.round) % 12) : 6 + ((i * 2 + g.round) % 12);

        // Generate realistic shooting and box score numbers based on player position/minutes
        const t1a = Math.floor((minutes / 10) * (0.8 + ((i + g.round) % 3) * 0.4));
        const t1i = t1a + ((i + g.round) % 2);
        const t2a = Math.floor((minutes / 8) * (0.9 + ((i * 2 + g.round) % 3) * 0.5));
        const t2i = t2a + 1 + ((i + g.round) % 4);
        const t3a = player.position === "Escolta" || player.position === "Base" || player.position === "Alero"
          ? 1 + ((i + g.round) % 3)
          : (i % 2 === 0 ? 1 : 0);
        const t3i = t3a + 1 + ((i + g.round) % 3);

        const oreb = player.position === "Pívot" || player.position === "Ala-Pívot" ? 1 + ((i + g.round) % 3) : ((i + g.round) % 2);
        const dreb = player.position === "Pívot" || player.position === "Ala-Pívot" ? 3 + ((i * 2 + g.round) % 5) : 1 + ((i + g.round) % 3);
        const asis = player.position === "Base" ? 4 + ((i + g.round) % 5) : ((i + g.round) % 3);
        const rec = 1 + ((i + g.round) % 3);
        const per = 1 + ((i * 2 + g.round) % 3);
        const falt = 1 + ((i + g.round) % 4);

        // Standard valuation formula:
        // Points (t1a + 2*t2a + 3*t3a) + Total Rebounds (oreb + dreb) + Asis + Rec - Missed FT (t1i - t1a) - Missed 2P (t2i - t2a) - Missed 3P (t3i - t3a) - Per - Falt
        const points = t1a * 1 + t2a * 2 + t3a * 3;
        const missedFT = t1i - t1a;
        const missed2P = t2i - t2a;
        const missed3P = t3i - t3a;
        const valuation = (points + (oreb + dreb) + asis + rec) - (missedFT + missed2P + missed3P + per + falt);

        await db.insert(playerStats).values({
          gameId: game.id,
          playerId: player.id,
          minutes,
          t1a,
          t1i,
          t2a,
          t2i,
          t3a,
          t3i,
          oreb,
          dreb,
          asis,
          rec,
          per,
          falt,
          valuation,
        });
      }
    }
    console.log(`   🏟️ Inserted ${teamConfig.games.length} games with full player statistics.`);

    // 2.4 Insert Trainings and Training Attendance
    for (const t of teamConfig.trainings) {
      const [training] = await db
        .insert(trainings)
        .values({
          teamId,
          trainingNumber: t.trainingNumber,
          date: t.date,
          warmup1: t.warmup1,
          warmup1Explanation: t.warmup1Explanation,
          warmup2: t.warmup2,
          warmup2Explanation: t.warmup2Explanation,
          warmup3: t.warmup3,
          warmup3Explanation: t.warmup3Explanation,
          exercise1: t.exercise1,
          exercise1Explanation: t.exercise1Explanation,
          exercise2: t.exercise2,
          exercise2Explanation: t.exercise2Explanation,
          exercise3: t.exercise3,
          exercise3Explanation: t.exercise3Explanation,
          exercise4: t.exercise4,
          exercise4Explanation: t.exercise4Explanation,
          exercise5: t.exercise5,
          exercise5Explanation: t.exercise5Explanation,
          exercise6: t.exercise6,
          exercise6Explanation: t.exercise6Explanation,
          cooldown1: t.cooldown1,
          cooldown1Explanation: t.cooldown1Explanation,
          cooldown2: t.cooldown2,
          cooldown2Explanation: t.cooldown2Explanation,
        })
        .returning();

      totalTrainingsCount++;

      // Insert Attendance for each player in this team
      for (let i = 0; i < insertedPlayers.length; i++) {
        const player = insertedPlayers[i];
        // Most players attend (90%+ attendance rate), occasional absence with note
        const isAbsent = (i + t.trainingNumber) % 11 === 0;
        const attended = isAbsent ? 0 : 1;
        let notes: string | undefined;

        if (isAbsent) {
          const reasons = [
            "Baja por motivos laborales/académicos",
            "Sobrecarga muscular en gemelo (reposo preventivo)",
            "Gripe / indisposición",
            "Cita médica de seguimiento",
          ];
          notes = reasons[(i + t.trainingNumber) % reasons.length];
        } else if ((i + t.trainingNumber) % 7 === 0) {
          notes = "Llega 10 min tarde con aviso previo";
        }

        await db.insert(trainingPlayers).values({
          trainingId: training.id,
          playerId: player.id,
          attended,
          notes,
        });
      }
    }
    console.log(`   📋 Inserted ${teamConfig.trainings.length} training sessions with player attendance.`);
  }

  console.log("🎉 Database seeding completed successfully!");
  console.log(`📊 Summary: ${SEED_TEAMS_DATA.length} Teams | ${totalPlayersCount} Players | ${totalGamesCount} Games | ${totalTrainingsCount} Trainings`);

  return {
    teamsCount: SEED_TEAMS_DATA.length,
    playersCount: totalPlayersCount,
    gamesCount: totalGamesCount,
    trainingsCount: totalTrainingsCount,
  };
}

export default seedDatabase;
