import { SvPoolGet } from "./SvPoolGet";

export interface SvEntryAndPools {
  username: string;
  score: number;
  wins: number;
  losses: number;
  pushes: number;
  currentStreak: number;
  pools: SvPoolGet[];
}
