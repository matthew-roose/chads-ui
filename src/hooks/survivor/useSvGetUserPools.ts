import { useQuery } from "@tanstack/react-query";
import { SvEntryAndPools } from "../../types/survivor/SvEntryAndPools";

export const useSvGetUserPools = (username?: string) =>
  useQuery(
    ["sv-pools", username],
    (): Promise<SvEntryAndPools> =>
      fetch(`${process.env.REACT_APP_API_URL}/survivor/entry/${username}`).then(
        (res) => res.json()
      ),
    {
      enabled: username !== undefined && username !== "",
    }
  );
