import { useQuery } from "@tanstack/react-query";
import { ScHeadToHeadStats } from "../../types/supercontest/ScHeadToHeadStats";

export const useScGetHeadToHeadStats = (
  username1?: string,
  username2?: string
) =>
  useQuery(
    ["sc-h2h-stats", username1, username2],
    (): Promise<ScHeadToHeadStats[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/h2h-stats/${username1}/${username2}`
      ).then((res) => res.json()),
    {
      enabled:
        username1 !== undefined &&
        username1 !== "" &&
        username2 !== undefined &&
        username2 !== "" &&
        username1 !== username2,
    }
  );
