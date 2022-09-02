import { useQuery } from "@tanstack/react-query";
import { ScEntryWeekAndPicks } from "../../types/supercontest/ScEntryWeekAndPicks";

export const useScGetPrevWeekBestPicks = (currentWeekNumber?: number) =>
  useQuery(
    ["sc-best-picks", currentWeekNumber],
    (): Promise<ScEntryWeekAndPicks[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/best-picks/week/${
          currentWeekNumber ? currentWeekNumber - 1 : 0
        }`
      ).then((res) => res.json()),
    {
      enabled: currentWeekNumber !== undefined && currentWeekNumber > 1,
    }
  );
