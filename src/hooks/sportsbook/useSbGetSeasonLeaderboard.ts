import { useQuery } from "@tanstack/react-query";
import { SbAccount } from "../../types/sportsbook/SbAccount";

export const useSbGetSeasonLeaderboard = () =>
  useQuery(
    ["sb-season-leaderboard"],
    (): Promise<SbAccount[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/leaderboard/season`
      ).then((res) => res.json())
  );
