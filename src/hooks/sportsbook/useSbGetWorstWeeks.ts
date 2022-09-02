import { useQuery } from "@tanstack/react-query";
import { SbWeeklyUserStats } from "../../types/sportsbook/SbWeeklyUserStats";

export const useSbGetWorstWeeks = () =>
  useQuery(
    ["sb-worst-weeks"],
    (): Promise<SbWeeklyUserStats[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/leaderboard/worst-weeks`
      ).then((res) => res.json())
  );
