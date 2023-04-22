import { useMutation } from "@tanstack/react-query";
import { SbAccount } from "../../types/sportsbook/SbAccount";

interface SbCashOutRequest {
  googleJwt: string;
  cashOutAmount?: number;
}

const cashOut = async (request: SbCashOutRequest): Promise<SbAccount> =>
  fetch(`${process.env.REACT_APP_API_URL}/sportsbook/cash-out`, {
    body: (request.cashOutAmount || 0).toString(),
    method: "POST",
    headers: {
      Authorization: request.googleJwt,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const useSbCashOut = () =>
  useMutation((request: SbCashOutRequest) => cashOut(request));
