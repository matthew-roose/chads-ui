import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";

export interface SvPublicPick {
  weekNumber: number;
  pickedTeam: keyof typeof AllTeamLogos;
  opposingTeam: keyof typeof AllTeamLogos;
  homeTeam: keyof typeof AllTeamLogos;
  timesPicked: number;
  homeScore: number | null;
  awayScore: number | null;
  result: Result | null;
}
