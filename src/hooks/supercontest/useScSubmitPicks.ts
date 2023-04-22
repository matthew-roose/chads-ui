import { useMutation } from "@tanstack/react-query";
import { ScEntryWeekAndPicks } from "../../types/supercontest/ScEntryWeekAndPicks";
import { ScPickCreate } from "../../types/supercontest/ScPickCreate";

interface ScSubmitPicksRequest {
  googleJwt: string;
  picks: ScPickCreate[];
}

const submitPicks = async (
  request: ScSubmitPicksRequest
): Promise<ScEntryWeekAndPicks> =>
  fetch(`${process.env.REACT_APP_API_URL}/supercontest/submit-picks`, {
    body: JSON.stringify(request.picks),
    method: "PUT",
    headers: {
      Authorization: request.googleJwt,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const useScSubmitPicks = () =>
  useMutation((request: ScSubmitPicksRequest) => submitPicks(request));
