import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";
import { SbBetLegType } from "./SbBetLegType";

export interface SbNullableBetLegGet {
  id: number;
  timestamp: number | null;
  betLegType: SbBetLegType | null;
  odds: number | null;
  homeSpread: number | null;
  gameTotal: number | null;
  homeTeam: keyof typeof AllTeamLogos | null;
  awayTeam: keyof typeof AllTeamLogos | null;
  homeScore: number | null;
  awayScore: number | null;
  result: Result | null;
}
