import { useQuery } from "@tanstack/react-query";
import { SbSeasonBreakdown } from "../../types/sportsbook/SbSeasonBreakdown";

export const useSbGetUserSeasonBreakdown = (username?: string) =>
  useQuery(
    ["sb-season-breakdown", username],
    (): Promise<SbSeasonBreakdown> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/account/${username}/season-breakdown-stats`
      ).then((res) => res.json()),
    {
      enabled: username !== undefined && username !== "",
    }
  );
