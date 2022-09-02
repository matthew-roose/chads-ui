import { useMutation } from "@tanstack/react-query";
import { SbAccount } from "../../types/sportsbook/SbAccount";

export const useSbDeposit = (googleJwt: string) =>
  useMutation(
    (): Promise<SbAccount> =>
      fetch(`${process.env.REACT_APP_API_URL}/sportsbook/deposit`, {
        method: "POST",
        headers: {
          Authorization: googleJwt,
        },
      }).then((res) => res.json())
  );
