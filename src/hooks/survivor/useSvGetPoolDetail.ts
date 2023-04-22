import { useQuery } from "@tanstack/react-query";
import { SvPoolDetail } from "../../types/survivor/SvPoolDetail";

export const useSvGetPoolDetail = (googleJwt: string, poolName?: string) =>
  useQuery(
    ["sv-pool-detail", poolName],
    (): Promise<SvPoolDetail> =>
      fetch(`${process.env.REACT_APP_API_URL}/survivor/pool/${poolName}`, {
        headers: {
          Authorization: googleJwt,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    {
      enabled: poolName !== undefined && poolName !== "",
    }
  );
