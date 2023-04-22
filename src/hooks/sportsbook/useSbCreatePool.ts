import { useMutation } from "@tanstack/react-query";
import { SbPoolCreate } from "../../types/sportsbook/SbPoolCreate";
import { SbPoolGet } from "../../types/sportsbook/SbPoolGet";

interface SbCreatePoolRequest {
  googleJwt: string;
  pool: SbPoolCreate;
}

const createPool = async (request: SbCreatePoolRequest): Promise<SbPoolGet> =>
  fetch(`${process.env.REACT_APP_API_URL}/sportsbook/pool`, {
    body: JSON.stringify(request.pool),
    method: "POST",
    headers: {
      Authorization: request.googleJwt,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const useSbCreatePool = () =>
  useMutation((request: SbCreatePoolRequest) => createPool(request));
