import { useQuery } from "@tanstack/react-query";
import { SvEntryAndNullablePicks } from "../../types/survivor/SvEntryAndNullablePicks";

export const useSvGetLeaderboard = (googleJwt: string) =>
  useQuery(
    ["sv-season-leaderboard"],
    (): Promise<SvEntryAndNullablePicks[]> =>
      fetch(`${process.env.REACT_APP_API_URL}/survivor/leaderboard`, {
        headers: {
          Authorization: googleJwt,
        },
      }).then((res) => res.json())
  );
