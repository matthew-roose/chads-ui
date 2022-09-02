import { useMutation } from "@tanstack/react-query";
import { SbBetCreate } from "../../types/sportsbook/SbBetCreate";
import { SbBetGet } from "../../types/sportsbook/SbBetGet";

export const useSbPlaceBet = (googleJwt: string, bet: SbBetCreate) =>
  useMutation(
    (): Promise<SbBetGet> =>
      fetch(`${process.env.REACT_APP_API_URL}/sportsbook/place-bet`, {
        body: JSON.stringify(bet),
        method: "POST",
        headers: {
          Authorization: googleJwt,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
  );
