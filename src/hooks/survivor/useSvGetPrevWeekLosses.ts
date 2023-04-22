import { useQuery } from "@tanstack/react-query";
import { SvPickGet } from "../../types/survivor/SvPickGet";

export const useSvGetPrevWeekLosses = (currentWeekNumber?: number) =>
  useQuery(
    ["sv-prev-week-losses", currentWeekNumber],
    (): Promise<SvPickGet[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/survivor/losers/week/${
          currentWeekNumber ? currentWeekNumber - 1 : 0
        }`
      ).then((res) => res.json()),
    {
      enabled: currentWeekNumber !== undefined && currentWeekNumber > 1,
    }
  );
