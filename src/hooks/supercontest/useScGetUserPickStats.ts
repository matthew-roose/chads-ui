import { useQuery } from "@tanstack/react-query";
import { ScPickStats } from "../../types/supercontest/ScPickStats";

export const useScGetUserPickStats = (username?: string) =>
  useQuery(
    ["sc-pick-stats", username],
    (): Promise<ScPickStats[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/entry/${username}/pick-stats`
      ).then((res) => res.json()),
    {
      enabled: username !== undefined && username !== "",
    }
  );
