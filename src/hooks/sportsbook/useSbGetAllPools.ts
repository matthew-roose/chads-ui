import { useQuery } from "@tanstack/react-query";
import { SbPoolGet } from "../../types/sportsbook/SbPoolGet";

export const useSbGetAllPools = () =>
  useQuery(
    ["sb-pools"],
    (): Promise<SbPoolGet[]> =>
      fetch(`${process.env.REACT_APP_API_URL}/sportsbook/pool/all`).then(
        (res) => res.json()
      )
  );
