import { useMutation } from "@tanstack/react-query";
import { SvPoolCreate } from "../../types/survivor/SvPoolCreate";
import { SvPoolGet } from "../../types/survivor/SvPoolGet";

interface SvCreatePoolRequest {
  googleJwt: string;
  pool: SvPoolCreate;
}

const createPool = async (request: SvCreatePoolRequest): Promise<SvPoolGet> =>
  fetch(`${process.env.REACT_APP_API_URL}/survivor/pool`, {
    body: JSON.stringify(request.pool),
    method: "POST",
    headers: {
      Authorization: request.googleJwt,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const useSvCreatePool = () =>
  useMutation((request: SvCreatePoolRequest) => createPool(request));
