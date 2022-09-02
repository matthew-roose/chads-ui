import { useQuery } from "@tanstack/react-query";
import { SbAccountAndPools } from "../../types/sportsbook/SbAccountAndPools";

export const useSbGetUserPools = (username?: string) =>
  useQuery(
    ["sb-pools", username],
    (): Promise<SbAccountAndPools> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/account/${username}`
      ).then((res) => res.json()),
    {
      enabled: username !== undefined && username !== "",
    }
  );
