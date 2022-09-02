import { useQuery } from "@tanstack/react-query";
import { ScEntryAndEntryWeeks } from "../../types/supercontest/ScEntryAndEntryWeeks";

export const useScGetAllUserEntryWeeks = (username?: string) =>
  useQuery(
    ["sc-entry-weeks", username],
    (): Promise<ScEntryAndEntryWeeks> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/entry/${username}/weekly-stats`
      ).then((res) => res.json()),
    {
      enabled: username !== undefined && username !== "",
    }
  );
