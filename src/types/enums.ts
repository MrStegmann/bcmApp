export enum TopMenuEnums {
  ROSTER = "ROSTER",
  GAMES = "GAMES",
  CALENDAR = "CALENDAR",
  MANAGE = "MANAGE",
  MAIN = "MAIN",
  PLAYERS = "PLAYERS",
  EDIT_TEAM = "EDIT_TEAM",
  GO_BACK = "GO_BACK",
  ADD_NEW_TEAM = "ADD_NEW_TEAM",
  ADD_NEW_PLAYER = "ADD_NEW_PLAYER",
}

export const MonthEnums = {
  Enero: "Enero",
  Febrero: "Febrero",
  Marzo: "Marzo",
  Abril: "Abril",
  Mayo: "Mayo",
  Junio: "Junio",
  Julio: "Julio",
  Agosto: "Agosto",
  Septiembre: "Septiembre",
  Octubre: "Octubre",
  Noviembre: "Noviembre",
  Diciembre: "Diciembre",
} as const;

export type MonthType = keyof typeof MonthEnums;
