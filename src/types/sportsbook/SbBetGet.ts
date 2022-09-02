import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";
import { SbBetLegType } from "./SbBetLegType";
import { SbBetType } from "./SbBetType";

interface SbBetLegGet {
  id: number;
  timestamp: number;
  betLegType: SbBetLegType;
  odds: number;
  homeSpread: number;
  gameTotal: number;
  homeTeam: keyof typeof AllTeamLogos;
  awayTeam: keyof typeof AllTeamLogos;
  homeScore?: number;
  awayScore?: number;
  result?: Result;
}

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
  result?: Result;
  betLegs: SbBetLegGet[];
}
