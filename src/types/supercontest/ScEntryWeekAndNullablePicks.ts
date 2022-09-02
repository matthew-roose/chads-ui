import { ScNullablePickGet } from "./ScNullablePickGet";

export interface ScEntryWeekAndNullablePicks {
  username: string;
  weekNumber: number;
  weekScore: number;
  weekWins: number;
  weekLosses: number;
  weekPushes: number;
  picks: ScNullablePickGet[];
}
