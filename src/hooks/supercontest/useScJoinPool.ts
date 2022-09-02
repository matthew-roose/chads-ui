import { useMutation } from "@tanstack/react-query";
import { ScEntryandPools } from "../../types/supercontest/ScEntryAndPools";

export const useScJoinPool = (
  googleJwt: string,
  poolName?: string,
  password?: string
) =>
  useMutation(
    (): Promise<ScEntryandPools> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/pool/${poolName}/join`,
        {
          body: password || "placeholder",
          method: "POST",
          headers: {
            Authorization: googleJwt,
          },
        }
      ).then((res) => res.json())
  );
