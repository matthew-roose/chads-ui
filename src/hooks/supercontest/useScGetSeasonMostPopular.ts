import { useQuery } from "@tanstack/react-query";
import { ScPublicPick } from "../../types/supercontest/ScPublicPick";

export const useScGetSeasonMostPopular = () =>
  useQuery(
    ["sc-season-most-popular"],
    (): Promise<ScPublicPick[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/supercontest/public-picks/season`
      ).then((res) => res.json())
  );
