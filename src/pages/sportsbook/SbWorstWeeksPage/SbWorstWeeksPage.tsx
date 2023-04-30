import { Helmet } from "react-helmet-async";
import { useSbGetWorstWeeks } from "../../../hooks/sportsbook/useSbGetWorstWeeks";
import { SbWeeklyLeaderboard } from "../../../components/SbWeeklyLeaderboard/SbWeeklyLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbWorstWeeksPage.module.css";

export const SbWorstWeeksPage = () => {
  const { data: worstWeeksData } = useSbGetWorstWeeks();

  const leaderboardRows = worstWeeksData?.filter((week) => week.profit < 0);

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | Worst Weeks</title>
      </Helmet>
      <div className={classes.title}>Biggest Losing Weeks</div>
      {!leaderboardRows && <LoadingSpinner />}
      {leaderboardRows?.length === 0 && (
        <div className={classes.noStats}>No stats yet.</div>
      )}
      {leaderboardRows && leaderboardRows.length > 0 && (
        <SbWeeklyLeaderboard
          rows={leaderboardRows}
          showWeekColumn
          showParlayColumn={false}
        />
      )}
    </div>
  );
};
