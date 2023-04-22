import { useQuery } from "@tanstack/react-query";
import { ScEntryWeek } from "../../types/supercontest/ScEntryWeek";

export const useScGetPublicEntryWeeks = () =>
  useQuery(
    ["sc-public-entry-weeks"],
    (): Promise<ScEntryWeek[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/public-picks/record`
      ).then((res) => res.json())
  );
