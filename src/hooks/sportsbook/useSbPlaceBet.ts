import { useMutation } from "@tanstack/react-query";
import { SbBetCreate } from "../../types/sportsbook/SbBetCreate";
import { SbBetGet } from "../../types/sportsbook/SbBetGet";

interface SbPlaceBetRequest {
  googleJwt: string;
  bet: SbBetCreate;
}

const placeBet = async (request: SbPlaceBetRequest): Promise<SbBetGet> =>
  fetch(`${process.env.REACT_APP_API_URL}/sportsbook/place-bet`, {
    body: JSON.stringify(request.bet),
    method: "POST",
    headers: {
      Authorization: request.googleJwt,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const useSbPlaceBet = () =>
  useMutation((request: SbPlaceBetRequest) => placeBet(request));
