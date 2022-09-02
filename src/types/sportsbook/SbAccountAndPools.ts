import { SbPoolGet } from "./SbPoolGet";

export interface SbAccountAndPools {
  username: string;
  availableBalance: number;
  pendingBalance: number;
  depositTotal: number;
  cashOutTotal: number;
  winLossTotal: number;
  bestParlayOdds: number;
  pools: SbPoolGet[];
}
