import { useMutation } from "@tanstack/react-query";
import { SbAccountAndPools } from "../../types/sportsbook/SbAccountAndPools";

interface SbJoinPoolRequest {
  googleJwt: string;
  poolName?: string;
  password?: string;
}

const joinPool = async (
  request: SbJoinPoolRequest
): Promise<SbAccountAndPools> =>
  fetch(
    `${process.env.REACT_APP_API_URL}/sportsbook/pool/${request.poolName}/join`,
    {
      body: request.password || "placeholder",
      method: "POST",
      headers: {
        Authorization: request.googleJwt,
      },
    }
  ).then((res) => res.json());

export const useSbJoinPool = () =>
  useMutation((request: SbJoinPoolRequest) => joinPool(request));
