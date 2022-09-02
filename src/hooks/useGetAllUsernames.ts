import { useQuery } from "@tanstack/react-query";

export const useGetAllUsernames = () =>
  useQuery(
    ["allUsers"],
    (): Promise<string[]> =>
      fetch(`${process.env.REACT_APP_API_URL}/all-usernames`).then((res) =>
        res.json()
      )
  );
