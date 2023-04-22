import { SvEntryAndNullablePicks } from "./SvEntryAndNullablePicks";

export interface SvPoolDetail {
  poolName: string;
  creatorUsername: string;
  buyIn: number;
  joinType: string;
  entries: SvEntryAndNullablePicks[];
}
