import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";

// everything can be null if it's a future pick of another user
export interface ScNullablePickGet {
  gameId: number | null;
  timestamp: number | null;
  pickedTeam: keyof typeof AllTeamLogos | null;
  homeTeam: keyof typeof AllTeamLogos | null;
  awayTeam: keyof typeof AllTeamLogos | null;
  homeSpread: number | null;
  homeScore: number | null;
  awayScore: number | null;
  result: Result | null;
}
