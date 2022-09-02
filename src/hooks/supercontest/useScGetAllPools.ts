import { useQuery } from "@tanstack/react-query";
import { ScPoolGet } from "../../types/supercontest/ScPoolGet";

export const useScGetAllPools = () =>
  useQuery(
    ["sc-pools"],
    (): Promise<ScPoolGet[]> =>
      fetch(`${process.env.REACT_APP_API_URL}/supercontest/pool/all`).then(
        (res) => res.json()
      )
  );
