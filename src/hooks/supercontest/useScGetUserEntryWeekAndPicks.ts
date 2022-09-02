import { useQuery } from "@tanstack/react-query";
import { ScEntryWeekAndPicks } from "../../types/supercontest/ScEntryWeekAndPicks";

export const useScGetUserEntryWeekAndPicks = (
  googleJwt: string,
  username?: string,
  weekNumber?: number
) =>
  useQuery(
    ["sc-picks", username, weekNumber],
    (): Promise<ScEntryWeekAndPicks> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/entry/${username}/week/${weekNumber}`,
        {
          headers: {
            Authorization: googleJwt,
          },
        }
      ).then((res) => res.json()),
    {
      enabled:
        username !== undefined && username !== "" && weekNumber !== undefined,
    }
  );
