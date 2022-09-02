import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";

// everything can be null if it's a future pick of another user
export interface ScNullablePickGet {
  gameId?: number;
  timestamp?: number;
  pickedTeam?: keyof typeof AllTeamLogos;
  homeTeam?: keyof typeof AllTeamLogos;
  awayTeam?: keyof typeof AllTeamLogos;
  homeSpread?: number;
  homeTeamScore?: number;
  awayTeamScore?: number;
  result?: Result;
}
