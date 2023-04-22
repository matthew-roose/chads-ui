import { useMutation } from "@tanstack/react-query";
import { ScPoolCreate } from "../../types/supercontest/ScPoolCreate";
import { ScPoolGet } from "../../types/supercontest/ScPoolGet";

interface ScCreatePoolRequest {
  googleJwt: string;
  pool: ScPoolCreate;
}

const createPool = async (request: ScCreatePoolRequest): Promise<ScPoolGet> =>
  fetch(`${process.env.REACT_APP_API_URL}/supercontest/pool`, {
    body: JSON.stringify(request.pool),
    method: "POST",
    headers: {
      Authorization: request.googleJwt,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const useScCreatePool = () =>
  useMutation((request: ScCreatePoolRequest) => createPool(request));
