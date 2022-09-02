import { useQuery } from "@tanstack/react-query";
import { ScPublicPick } from "../../types/supercontest/ScPublicPick";

export const useScGetWeekMostPopular = (weekNumber?: number) =>
  useQuery(
    ["sc-week-most-popular", weekNumber],
    (): Promise<ScPublicPick[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/public-picks/week/${weekNumber}`
      ).then((res) => res.json()),
    {
      enabled: weekNumber !== undefined,
    }
  );
