import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";
import { SbBetLegType } from "./SbBetLegType";

export interface SbBetLegGet {
  id: number;
  timestamp: number;
  betLegType: SbBetLegType;
  odds: number;
  homeSpread: number;
  gameTotal: number;
  homeTeam: keyof typeof AllTeamLogos;
  awayTeam: keyof typeof AllTeamLogos;
  homeScore: number | null;
  awayScore: number | null;
  result: Result | null;
}
