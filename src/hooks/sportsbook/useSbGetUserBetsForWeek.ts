import { useQuery } from "@tanstack/react-query";
import { SbBetGet } from "../../types/sportsbook/SbBetGet";

export const useSbGetUserBetsForWeek = (
  googleJwt: string,
  username?: string,
  weekNumber?: number
) =>
  useQuery(
    ["sb-bets", username, weekNumber],
    (): Promise<SbBetGet[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/account/${username}/bets/week/${weekNumber}`,
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
