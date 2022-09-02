import { SbBetLegType } from "./SbBetLegType";

export interface SbBetLegCreate {
  gameId: number;
  betLegType: SbBetLegType;
}

export interface SbBetCreate {
  wager: number;
  betLegs: SbBetLegCreate[];
}
