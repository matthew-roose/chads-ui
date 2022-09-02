import { useMutation } from "@tanstack/react-query";
import { SbAccountAndPools } from "../../types/sportsbook/SbAccountAndPools";

export const useSbJoinPool = (
  googleJwt: string,
  poolName?: string,
  password?: string
) =>
  useMutation(
    (): Promise<SbAccountAndPools> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/pool/${poolName}/join`,
        {
          body: password || "placeholder",
          method: "POST",
          headers: {
            Authorization: googleJwt,
          },
        }
      ).then((res) => res.json())
  );
