import { useMutation } from "@tanstack/react-query";
import { ScPoolCreate } from "../../types/supercontest/ScPoolCreate";
import { ScPoolGet } from "../../types/supercontest/ScPoolGet";

export const useScCreatePool = (googleJwt: string, pool: ScPoolCreate) =>
  useMutation(
    (): Promise<ScPoolGet> =>
      fetch(`${process.env.REACT_APP_API_URL}/supercontest/pool`, {
        body: JSON.stringify(pool),
        method: "POST",
        headers: {
          Authorization: googleJwt,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
  );
