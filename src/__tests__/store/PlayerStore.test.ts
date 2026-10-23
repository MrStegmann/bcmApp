import { usePlayerStore } from "../../store/PlayerStore";
import { Player, NewPlayer } from "../../types/database";
import { db, players, teams } from "../../db";
import { eq } from "drizzle-orm";

declare const beforeAll: any;
declare const jest: any;

describe("PlayerStore Unit Tests", () => {
  let testTeamId = 1;

  beforeAll(async () => {
    // Ensure test team exists
    const [team] = await db
      .insert(teams)
      .values({ name: "Store Test Team", category: "Junior" })
      .returning();
    if (team) {
      testTeamId = team.id;
    }
  });

  beforeEach(() => {
    usePlayerStore.setState({
      playersList: [],
      players: [],
      selectedPlayer: null,
      isLoading: false,
      error: null,
    });
  });

  it("should initialize with empty players list", () => {
    const state = usePlayerStore.getState();
    expect(state.playersList).toEqual([]);
    expect(state.selectedPlayer).toBeNull();
  });

  it("should set selected player correctly with jerseyName", () => {
    const mockPlayer: Player = {
      id: 1,
      teamId: testTeamId,
      firstName: "Patrick",
      lastName: "Stegmann",
      number: "10",
      jerseyName: "STEGMANN",
      createdAt: "2025-09-25",
    };

    usePlayerStore.getState().setSelectedPlayer(mockPlayer);

    const state = usePlayerStore.getState();
    expect(state.selectedPlayer).toEqual(mockPlayer);
    expect(state.selectedPlayer?.jerseyName).toBe("STEGMANN");
    expect((state.selectedPlayer as any).position).toBeUndefined();
    expect((state.selectedPlayer as any).notes).toBeUndefined();
  });

  it("should create a player with jerseyName and persist to database and store", async () => {
    const newPlayerData: NewPlayer = {
      teamId: testTeamId,
      firstName: "Michael",
      lastName: "Jordan",
      number: "23",
      jerseyName: "JORDAN",
    };

    const created = await usePlayerStore.getState().createPlayer(newPlayerData);

    expect(created).not.toBeNull();
    expect(created?.firstName).toBe("Michael");
    expect(created?.number).toBe("23");
    expect(created?.jerseyName).toBe("JORDAN");

    const state = usePlayerStore.getState();
    expect(state.playersList.some((p) => p.id === created?.id)).toBe(true);

    // Verify in db
    const [fromDb] = await db.select().from(players).where(eq(players.id, created!.id));
    expect(fromDb.jerseyName).toBe("JORDAN");
  });

  it("should create a player without jerseyName (optional field)", async () => {
    const newPlayerData: NewPlayer = {
      teamId: testTeamId,
      firstName: "Scottie",
      lastName: "Pippen",
      number: "33",
    };

    const created = await usePlayerStore.getState().createPlayer(newPlayerData);

    expect(created).not.toBeNull();
    expect(created?.firstName).toBe("Scottie");
    expect(created?.jerseyName ?? null).toBeNull();

    // Verify in db
    const [fromDb] = await db.select().from(players).where(eq(players.id, created!.id));
    expect(fromDb.jerseyName).toBeNull();
  });

  it("should update a player jerseyName", async () => {
    const [created] = await db
      .insert(players)
      .values({
        teamId: testTeamId,
        firstName: "Dennis",
        lastName: "Rodman",
        number: "91",
        jerseyName: null,
      })
      .returning();

    usePlayerStore.setState({ playersList: [created], players: [created] });

    const success = await usePlayerStore.getState().updatePlayer(created.id, {
      jerseyName: "THE WORM",
    });

    expect(success).toBe(true);

    const state = usePlayerStore.getState();
    const updated = state.playersList.find((p) => p.id === created.id);
    expect(updated?.jerseyName).toBe("THE WORM");

    // Verify in db
    const [fromDb] = await db.select().from(players).where(eq(players.id, created.id));
    expect(fromDb.jerseyName).toBe("THE WORM");
  });

  it("should delete a player from store and database", async () => {
    const [created] = await db
      .insert(players)
      .values({
        teamId: testTeamId,
        firstName: "Steve",
        lastName: "Kerr",
        number: "25",
        jerseyName: "KERR",
      })
      .returning();

    usePlayerStore.setState({ playersList: [created], players: [created] });

    const success = await usePlayerStore.getState().deletePlayer(created.id);
    expect(success).toBe(true);

    const state = usePlayerStore.getState();
    expect(state.playersList.find((p) => p.id === created.id)).toBeUndefined();

    const inDb = await db.select().from(players).where(eq(players.id, created.id));
    expect(inDb.length).toBe(0);
  });
});
