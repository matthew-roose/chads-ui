import { useQuery } from "@tanstack/react-query";
import { ScEntryWeekAndNullablePicks } from "../../types/supercontest/ScEntryWeekAndNullablePicks";

export const useScGetUserEntryWeekAndNullablePicks = (
  googleJwt: string,
  username?: string,
  weekNumber?: number
) =>
  useQuery(
    ["sc-nullable-picks", username, weekNumber],
    (): Promise<ScEntryWeekAndNullablePicks> =>
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
