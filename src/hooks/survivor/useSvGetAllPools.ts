import { useQuery } from "@tanstack/react-query";
import { SvPoolGet } from "../../types/survivor/SvPoolGet";

export const useSvGetAllPools = () =>
  useQuery(
    ["sv-pools"],
    (): Promise<SvPoolGet[]> =>
      fetch(`${process.env.REACT_APP_API_URL}/survivor/pool/all`).then((res) =>
        res.json()
      )
  );
