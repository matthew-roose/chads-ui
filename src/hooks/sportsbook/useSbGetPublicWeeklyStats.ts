import { useQuery } from "@tanstack/react-query";
import { SbWeeklyUserStats } from "../../types/sportsbook/SbWeeklyUserStats";

export const useSbGetPublicWeeklyStats = () =>
  useQuery(
    ["sb-public-weekly-stats"],
    (): Promise<SbWeeklyUserStats[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/public-weekly-stats`
      ).then((res) => res.json())
  );
