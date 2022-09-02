import { SbAccount } from "./SbAccount";

export interface SbPoolDetail {
  poolName: string;
  creatorUsername: string;
  buyIn: number;
  winLossPrizePct: number;
  bestParlayPrizePct: number;
  joinType: string;
  accounts: SbAccount[];
}
