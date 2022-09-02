import { useMutation } from "@tanstack/react-query";
import { SbPoolCreate } from "../../types/sportsbook/SbPoolCreate";
import { SbPoolGet } from "../../types/sportsbook/SbPoolGet";

export const useSbCreatePool = (googleJwt: string, pool: SbPoolCreate) =>
  useMutation(
    (): Promise<SbPoolGet> =>
      fetch(`${process.env.REACT_APP_API_URL}/sportsbook/pool`, {
        body: JSON.stringify(pool),
        method: "POST",
        headers: {
          Authorization: googleJwt,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
  );
