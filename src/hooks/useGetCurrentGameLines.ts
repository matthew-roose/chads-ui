import { useQuery } from "@tanstack/react-query";
import { GameLine } from "../types/GameLine";

export const useGetCurrentGameLines = () =>
  useQuery(
    ["gameLines"],
    (): Promise<GameLine[]> =>
      fetch(`${process.env.REACT_APP_API_URL}/lines`).then((res) => res.json())
  );
