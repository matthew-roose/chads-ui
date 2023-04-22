import { useQuery } from "@tanstack/react-query";
import { SvPublicPick } from "../../types/survivor/SvPublicPick";

export const useSvGetWeekMostPopular = (weekNumber?: number) =>
  useQuery(
    ["sv-week-most-popular", weekNumber],
    (): Promise<SvPublicPick[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/survivor/public-picks/week/${weekNumber}`
      ).then((res) => res.json()),
    {
      enabled: weekNumber !== undefined,
    }
  );
