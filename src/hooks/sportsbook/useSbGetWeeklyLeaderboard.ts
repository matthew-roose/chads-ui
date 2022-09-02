import { useQuery } from "@tanstack/react-query";
import { SbWeeklyUserStats } from "../../types/sportsbook/SbWeeklyUserStats";

export const useSbGetWeeklyLeaderboard = (weekNumber?: number) =>
  useQuery(
    ["sb-weekly-leaderboard", weekNumber],
    (): Promise<SbWeeklyUserStats[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/leaderboard/week/${weekNumber}`
      ).then((res) => res.json()),
    {
      enabled: weekNumber !== undefined,
    }
  );
