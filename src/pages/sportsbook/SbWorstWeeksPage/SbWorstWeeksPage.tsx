import { Helmet } from "react-helmet-async";
import { useSbGetWorstWeeks } from "../../../hooks/sportsbook/useSbGetWorstWeeks";
import classes from "./SbWorstWeeksPage.module.css";
import { SbWeeklyLeaderboard } from "../../../components/SbWeeklyLeaderboard/SbWeeklyLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const SbWorstWeeksPage = () => {
  const { data: worstWeeksData } = useSbGetWorstWeeks();

  if (!worstWeeksData) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  const leaderboardRows = worstWeeksData.filter((week) => week.profit < 0);

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Worst SB Weeks</title>
      </Helmet>
      <div className={classes.title}>Biggest Losing Weeks</div>
      <SbWeeklyLeaderboard
        rows={leaderboardRows}
        showWeekColumn
        showParlayColumn={false}
      />
    </div>
  );
};
