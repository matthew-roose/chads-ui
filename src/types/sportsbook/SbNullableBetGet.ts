import { Result } from "../Result";
import { SbBetType } from "./SbBetType";
import { SbNullableBetLegGet } from "./SbNullableBetLegGet";

export interface SbNullableBetGet {
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
  betLegs: SbNullableBetLegGet[];
}
