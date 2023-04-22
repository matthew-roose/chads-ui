import { useQuery } from "@tanstack/react-query";
import { SvEntryAndPicks } from "../../types/survivor/SvEntryAndPicks";

export const useSvGetUserEntryAndPicks = (
  googleJwt: string,
  username?: string
) =>
  useQuery(
    ["sv-picks", username],
    (): Promise<SvEntryAndPicks> =>
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
