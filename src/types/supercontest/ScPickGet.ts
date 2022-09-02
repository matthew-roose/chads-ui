import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";

// use this type when pick fields aren't nullable
export interface ScPickGet {
  gameId: number;
  timestamp: number;
  pickedTeam: keyof typeof AllTeamLogos;
  homeTeam: keyof typeof AllTeamLogos;
  awayTeam: keyof typeof AllTeamLogos;
  homeSpread: number;
  homeTeamScore?: number;
  awayTeamScore?: number;
  result?: Result;
}
