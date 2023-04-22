import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";

export interface SvPickGet {
  username: string;
  gameId: number;
  weekNumber: number;
  timestamp: number;
  pickedTeam: keyof typeof AllTeamLogos;
  homeTeam: keyof typeof AllTeamLogos;
  awayTeam: keyof typeof AllTeamLogos;
  homeScore: number | null;
  awayScore: number | null;
  result: Result | null;
}
