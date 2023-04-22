import { SvPickGet } from "./SvPickGet";

export interface SvEntryAndPicks {
  username: string;
  score: number;
  wins: number;
  losses: number;
  pushes: number;
  currentStreak: number;
  picks: SvPickGet[];
}
