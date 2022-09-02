import { AllTeamLogos } from "../assets/AllTeamLogos";

export interface GameLine {
  gameId: number;
  weekNumber: number;
  timestamp: number;
  homeTeam: keyof typeof AllTeamLogos;
  awayTeam: keyof typeof AllTeamLogos;
  homeSpread: number;
  homeMoneyline: number;
  awayMoneyline: number;
  gameTotal: number;
  homeScore: number;
  awayScore: number;
}
