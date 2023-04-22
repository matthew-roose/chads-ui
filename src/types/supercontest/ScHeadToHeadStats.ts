import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";

export interface ScHeadToHeadStats {
  username: string;
  gameId: number;
  weekNumber: number;
  pickedTeam: keyof typeof AllTeamLogos;
  homeSpread: number;
  homeTeam: keyof typeof AllTeamLogos;
  awayTeam: keyof typeof AllTeamLogos;
  homeScore: number | null;
  awayScore: number | null;
  result: Result;
}
