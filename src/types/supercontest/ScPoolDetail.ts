import { ScEntryAndEntryWeeks } from "./ScEntryAndEntryWeeks";

export interface ScPoolDetail {
  poolName: string;
  creatorUsername: string;
  buyIn: number;
  joinType: string;
  entries: ScEntryAndEntryWeeks[];
}
