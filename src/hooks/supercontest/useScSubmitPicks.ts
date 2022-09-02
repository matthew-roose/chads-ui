import { useMutation } from "@tanstack/react-query";
import { ScEntryWeekAndPicks } from "../../types/supercontest/ScEntryWeekAndPicks";
import { ScPickCreate } from "../../types/supercontest/ScPickCreate";

export const useScSubmitPicks = (googleJwt: string, picks: ScPickCreate[]) =>
  useMutation(
    (): Promise<ScEntryWeekAndPicks> =>
      fetch(`${process.env.REACT_APP_API_URL}/supercontest/submit-picks`, {
        body: JSON.stringify(picks),
        method: "PUT",
        headers: {
          Authorization: googleJwt,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
  );
