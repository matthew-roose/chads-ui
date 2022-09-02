import { useQuery } from "@tanstack/react-query";
import { SbBetGet } from "../../types/sportsbook/SbBetGet";

export const useSbGetBestParlays = () =>
  useQuery(
    ["sb-best-parlays"],
    (): Promise<SbBetGet[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/leaderboard/best-parlays`
      ).then((res) => res.json())
  );
