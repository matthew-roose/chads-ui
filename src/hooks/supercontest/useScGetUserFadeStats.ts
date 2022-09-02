import { useQuery } from "@tanstack/react-query";
import { ScFadeStats } from "../../types/supercontest/ScFadeStats";

export const useScGetUserFadeStats = (username?: string) =>
  useQuery(
    ["sc-fade-stats", username],
    (): Promise<ScFadeStats[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/entry/${username}/fade-stats`
      ).then((res) => res.json()),
    {
      enabled: username !== undefined && username !== "",
    }
  );
