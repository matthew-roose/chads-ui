import { ScPoolGet } from "./ScPoolGet";

export interface ScEntryandPools {
  username: string;
  seasonScore: number;
  seasonWins: number;
  seasonLosses: number;
  seasonPushes: number;
  pools: ScPoolGet[];
}
