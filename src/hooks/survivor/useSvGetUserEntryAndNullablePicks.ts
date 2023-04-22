import { useQuery } from "@tanstack/react-query";
import { SvEntryAndNullablePicks } from "../../types/survivor/SvEntryAndNullablePicks";

export const useSvGetUserEntryAndNullablePicks = (
  googleJwt: string,
  username?: string
) =>
  useQuery(
    ["sv-picks", username],
    (): Promise<SvEntryAndNullablePicks> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/survivor/entry/${username}/picks`,
        {
          headers: {
            Authorization: googleJwt,
          },
        }
      ).then((res) => res.json()),
    {
      enabled: username !== undefined && username !== "",
    }
  );
