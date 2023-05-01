import { ScPickGet } from "./ScPickGet";

export interface ScEntryWeekAndPicks {
  username: string;
  weekNumber: number;
  weekScore: number;
  weekWins: number;
  weekLosses: number;
  weekPushes: number;
  hasMadePicks: boolean;
  picks: ScPickGet[];
}
