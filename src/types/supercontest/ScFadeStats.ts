import { AllTeamLogos } from "../../assets/AllTeamLogos";

export interface ScFadeStats {
  username: string;
  fadedTeam: keyof typeof AllTeamLogos;
  total: number;
  wins: number;
  losses: number;
  pushes: number;
}
