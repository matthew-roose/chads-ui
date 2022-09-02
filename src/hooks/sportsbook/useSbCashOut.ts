import { useMutation } from "@tanstack/react-query";
import { SbAccount } from "../../types/sportsbook/SbAccount";

export const useSbCashOut = (googleJwt: string, cashOutAmount?: number) =>
  useMutation(
    (): Promise<SbAccount> =>
      fetch(`${process.env.REACT_APP_API_URL}/sportsbook/cash-out`, {
        body: (cashOutAmount || 0).toString(),
        method: "POST",
        headers: {
          Authorization: googleJwt,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
  );
