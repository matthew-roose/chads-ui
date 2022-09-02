import { useQuery } from "@tanstack/react-query";
import { SbBetGet } from "../../types/sportsbook/SbBetGet";

export const useSbGetPrevWeekBestParlay = (currentWeekNumber?: number) =>
  useQuery(
    ["sb-best-parlay", currentWeekNumber],
    (): Promise<SbBetGet[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/best-parlay/week/${
          currentWeekNumber ? currentWeekNumber - 1 : 0
        }`
      ).then((res) => res.json()),
    {
      enabled: currentWeekNumber !== undefined && currentWeekNumber > 1,
    }
  );
