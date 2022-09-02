import { useQuery } from "@tanstack/react-query";
import { ScEntryWeek } from "../../types/supercontest/ScEntryWeek";

export const useScGetWeeklyLeaderboard = (weekNumber?: number) =>
  useQuery(
    ["sc-weekly-leaderboard", weekNumber],
    (): Promise<ScEntryWeek[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/leaderboard/week/${weekNumber}`
      ).then((res) => res.json()),
    {
      enabled: weekNumber !== undefined,
    }
  );
