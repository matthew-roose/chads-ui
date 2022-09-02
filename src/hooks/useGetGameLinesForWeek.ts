import { useQuery } from "@tanstack/react-query";
import { GameLine } from "../types/GameLine";

export const useGetGameLinesForWeek = (weekNumber?: number) =>
  useQuery(
    ["gameLines", weekNumber],
    (): Promise<GameLine[]> =>
      fetch(`${process.env.REACT_APP_API_URL}/lines/${weekNumber}`).then(
        (res) => res.json()
      ),
    {
      enabled: weekNumber !== undefined,
    }
  );
