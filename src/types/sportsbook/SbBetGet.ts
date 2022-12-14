import { Result } from "../Result";
import { SbBetLegGet } from "./SbBetLegGet";
import { SbBetType } from "./SbBetType";

export interface SbBetGet {
  id: number;
  username: string;
  placedTimestamp: number;
  weekNumber: number;
  betType: SbBetType;
  odds: number;
  effectiveOdds: number;
  wager: number;
  toWinAmount: number;
  effectiveToWinAmount: number;
  result: Result | null;
  betLegs: SbBetLegGet[];
}
