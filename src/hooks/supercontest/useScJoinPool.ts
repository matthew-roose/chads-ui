import { useMutation } from "@tanstack/react-query";
import { ScEntryandPools } from "../../types/supercontest/ScEntryAndPools";

interface ScJoinPoolRequest {
  googleJwt: string;
  poolName?: string;
  password?: string;
}

const joinPool = async (request: ScJoinPoolRequest): Promise<ScEntryandPools> =>
  fetch(
    `${process.env.REACT_APP_API_URL}/supercontest/pool/${request.poolName}/join`,
    {
      body: request.password || "placeholder",
      method: "POST",
      headers: {
        Authorization: request.googleJwt,
      },
    }
  ).then((res) => res.json());

export const useScJoinPool = () =>
  useMutation((request: ScJoinPoolRequest) => joinPool(request));
