import { useQuery } from "@tanstack/react-query";

export const useGetCurrentWeekNumber = () =>
  useQuery(
    ["currentWeekNumber"],
    (): Promise<number> =>
      fetch(`${process.env.REACT_APP_API_URL}/current-week-number`).then(
        (res) => res.json()
      )
  );
