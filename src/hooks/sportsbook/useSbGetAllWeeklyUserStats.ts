import { useQuery } from "@tanstack/react-query";
import { SbWeeklyUserStats } from "../../types/sportsbook/SbWeeklyUserStats";

export const useSbGetAllWeeklyUserStats = (username?: string) =>
  useQuery(
    ["sb-weekly-stats", username],
    (): Promise<SbWeeklyUserStats[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/account/${username}/weekly-stats`
      ).then((res) => res.json()),
    {
      enabled: username !== undefined && username !== "",
    }
  );
