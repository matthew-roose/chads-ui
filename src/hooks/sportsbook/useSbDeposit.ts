import { useMutation } from "@tanstack/react-query";
import { SbAccount } from "../../types/sportsbook/SbAccount";

interface SbDepositRequest {
  googleJwt: string;
}

const deposit = async (request: SbDepositRequest): Promise<SbAccount> =>
  fetch(`${process.env.REACT_APP_API_URL}/sportsbook/deposit`, {
    method: "POST",
    headers: {
      Authorization: request.googleJwt,
    },
  }).then((res) => res.json());

export const useSbDeposit = () =>
  useMutation((request: SbDepositRequest) => deposit(request));
