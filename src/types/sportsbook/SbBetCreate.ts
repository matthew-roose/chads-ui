import { SbBetLegCreate } from "./SbBetLegCreate";

export interface SbBetCreate {
  wager: number;
  betLegs: SbBetLegCreate[];
  teaserPoints: number | null;
}
