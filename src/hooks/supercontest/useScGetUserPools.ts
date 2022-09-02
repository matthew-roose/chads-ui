import { useQuery } from "@tanstack/react-query";
import { ScEntryandPools } from "../../types/supercontest/ScEntryAndPools";

export const useScGetUserPools = (username?: string) =>
  useQuery(
    ["sc-pools", username],
    (): Promise<ScEntryandPools> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/entry/${username}`
      ).then((res) => res.json()),
    {
      enabled: username !== undefined && username !== "",
    }
  );
