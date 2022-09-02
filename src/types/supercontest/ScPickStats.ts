import { AllTeamLogos } from "../../assets/AllTeamLogos";

export interface ScPickStats {
  username: string;
  pickedTeam: keyof typeof AllTeamLogos;
  total: number;
  wins: number;
  losses: number;
  pushes: number;
}
