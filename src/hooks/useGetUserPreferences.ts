import { useQuery } from "@tanstack/react-query";
import { UserPreferences } from "../types/UserPreferences";

export const useGetUserPreferences = (googleJwt: string) =>
  useQuery(
    ["user-preferences"],
    (): Promise<UserPreferences> =>
      fetch(`${process.env.REACT_APP_API_URL}/user-preferences`, {
        headers: {
          Authorization: googleJwt,
        },
      }).then((res) => res.json()),
    {
      enabled: googleJwt !== "",
    }
  );
