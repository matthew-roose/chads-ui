import { SvNullablePickGet } from "./SvNullablePickGet";

export interface SvEntryAndNullablePicks {
  username: string;
  score: number;
  wins: number;
  losses: number;
  pushes: number;
  currentStreak: number;
  picks: SvNullablePickGet[];
}
