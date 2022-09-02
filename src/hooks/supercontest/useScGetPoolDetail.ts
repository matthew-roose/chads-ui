import { useQuery } from "@tanstack/react-query";
import { ScPoolDetail } from "../../types/supercontest/ScPoolDetail";

export const useScGetPoolDetail = (poolName?: string) =>
  useQuery(
    ["sc-pool-detail", poolName],
    (): Promise<ScPoolDetail> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/pool/${poolName}`
      ).then((res) => res.json()),
    {
      enabled: poolName !== undefined && poolName !== "",
    }
  );
