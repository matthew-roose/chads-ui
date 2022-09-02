import { useQuery } from "@tanstack/react-query";
import { ScEntry } from "../../types/supercontest/ScEntry";

export const useScGetSeasonLeaderboard = () =>
  useQuery(
    ["sc-season-leaderboard"],
    (): Promise<ScEntry[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/leaderboard/season`
      ).then((res) => res.json())
  );
