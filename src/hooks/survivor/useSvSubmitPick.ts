import { useMutation } from "@tanstack/react-query";
import { SvPickCreate } from "../../types/survivor/SvPickCreate";
import { SvPickGet } from "../../types/survivor/SvPickGet";

interface SvSubmitPickRequest {
  googleJwt: string;
  pick: SvPickCreate | undefined;
}

const submitPick = async (request: SvSubmitPickRequest): Promise<SvPickGet> =>
  fetch(`${process.env.REACT_APP_API_URL}/survivor/submit-pick`, {
    body: JSON.stringify(request.pick),
    method: "PUT",
    headers: {
      Authorization: request.googleJwt,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const useSvSubmitPick = () =>
  useMutation((request: SvSubmitPickRequest) => submitPick(request));
