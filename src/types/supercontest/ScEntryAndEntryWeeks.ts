import { ScEntryWeek } from "./ScEntryWeek";

export interface ScEntryAndEntryWeeks {
  username: string;
  seasonScore: number;
  seasonWins: number;
  seasonLosses: number;
  seasonPushes: number;
  supercontestEntryWeeks: ScEntryWeek[];
}
