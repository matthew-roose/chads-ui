import { useQuery } from "@tanstack/react-query";
import { SvPublicPick } from "../../types/survivor/SvPublicPick";

export const useSvGetSeasonMostPopular = () =>
  useQuery(
    ["sv-season-most-popular"],
    (): Promise<SvPublicPick[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/survivor/public-picks/season`
      ).then((res) => res.json())
  );
