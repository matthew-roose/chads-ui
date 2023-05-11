import { SbBetLegType } from "./SbBetLegType";

export interface SbBetLegCreate {
  gameId: number;
  betLegType: SbBetLegType;
  boughtPoints?: number;
}
