import { useQuery } from "@tanstack/react-query";
import { SbWeeklyUserStats } from "../../types/sportsbook/SbWeeklyUserStats";

export const useSbGetBestWeeks = () =>
  useQuery(
    ["sb-best-weeks"],
    (): Promise<SbWeeklyUserStats[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/leaderboard/best-weeks`
      ).then((res) => res.json())
  );
