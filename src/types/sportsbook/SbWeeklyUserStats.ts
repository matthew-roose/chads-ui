export interface SbWeeklyUserStats {
  weekNumber: number;
  username: string;
  amountWagered: number;
  amountWon: number;
  amountLost: number;
  profit: number;
  bestParlayOdds: number | null;
}
