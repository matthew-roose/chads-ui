import { useMutation } from "@tanstack/react-query";
import { SvEntryAndPools } from "../../types/survivor/SvEntryAndPools";

interface SvJoinPoolRequest {
  googleJwt: string;
  poolName?: string;
  password?: string;
}

const joinPool = async (request: SvJoinPoolRequest): Promise<SvEntryAndPools> =>
  fetch(
    `${process.env.REACT_APP_API_URL}/survivor/pool/${request.poolName}/join`,
    {
      body: request.password || "placeholder",
      method: "POST",
      headers: {
        Authorization: request.googleJwt,
      },
    }
  ).then((res) => res.json());

export const useSvJoinPool = () =>
  useMutation((request: SvJoinPoolRequest) => joinPool(request));
