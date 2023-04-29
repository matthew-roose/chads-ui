import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../Result";

export interface SvPickCreate {
  gameId: number;
  pickedTeam: keyof typeof AllTeamLogos;
  // set result using existing entry week so win/loss can be shown on make picks page
  result?: Result | null;
}
