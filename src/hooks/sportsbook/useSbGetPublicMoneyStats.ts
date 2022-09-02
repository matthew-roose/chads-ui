import { useQuery } from "@tanstack/react-query";
import { SbPublicMoney } from "../../types/sportsbook/SbPublicMoney";

export const useSbGetPublicMoneyStats = (weekNumber?: number) =>
  useQuery(
    ["sb-public-money-stats", weekNumber],
    (): Promise<SbPublicMoney[]> =>
      fetch(
        `${process.env.REACT_APP_API_URL}/sportsbook/public-money/week/${weekNumber}`
      ).then((res) => res.json()),
    {
      enabled: weekNumber !== undefined,
    }
  );
