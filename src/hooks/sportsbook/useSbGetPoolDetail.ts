import { useQuery } from "@tanstack/react-query";
import { SbPoolDetail } from "../../types/sportsbook/SbPoolDetail";

export const useSbGetPoolDetail = (poolName?: string) =>
  useQuery(
    ["sb-pool-detail", poolName],
    (): Promise<SbPoolDetail> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/pool/${poolName}`
      ).then((res) => res.json()),
    {
      enabled: poolName !== undefined && poolName !== "",
    }
  );
