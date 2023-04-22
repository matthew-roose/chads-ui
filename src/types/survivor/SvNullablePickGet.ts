import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";

// everything can be null if it's a future pick of another user
export interface SvNullablePickGet {
  username: string;
  gameId: number | null;
  weekNumber: number;
  timestamp: number | null;
  pickedTeam: keyof typeof AllTeamLogos | null;
  homeTeam: keyof typeof AllTeamLogos | null;
  awayTeam: keyof typeof AllTeamLogos | null;
  homeScore: number | null;
  awayScore: number | null;
  result: Result | null;
}
