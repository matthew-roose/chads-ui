import { AllTeamLogos } from "../../assets/AllTeamLogos";

interface SbWinLossProfit {
  amountWagered: number;
  amountWon: number;
  amountLost: number;
  amountProfited: number;
}

interface SbSeasonBreakdownByBetType {
  [key: string]: SbWinLossProfit;
}

type SbSeasonBreakdownByTeam = {
  [team in keyof typeof AllTeamLogos]: SbWinLossProfit;
};

interface SbSeasonBreakdownByTotal {
  [key: string]: SbWinLossProfit;
}

export interface SbSeasonBreakdown {
  username: string;
  winsAndLossesByBetType: SbSeasonBreakdownByBetType;
  winsAndLossesByPickedTeam: SbSeasonBreakdownByTeam;
  winsAndLossesByFadedTeam: SbSeasonBreakdownByTeam;
  winsAndLossesByTotal: SbSeasonBreakdownByTotal;
}
