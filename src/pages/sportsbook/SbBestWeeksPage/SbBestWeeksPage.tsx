import { Helmet } from "react-helmet-async";
import { useSbGetBestWeeks } from "../../../hooks/sportsbook/useSbGetBestWeeks";
import { SbWeeklyLeaderboard } from "../../../components/SbWeeklyLeaderboard/SbWeeklyLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbBestWeeksPage.module.css";

export const SbBestWeeksPage = () => {
  const { data: bestWeeksData } = useSbGetBestWeeks();

  const leaderboardRows = bestWeeksData?.filter((week) => week.profit > 0);

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | Best Weeks</title>
      </Helmet>
      <div className={classes.title}>Biggest Winning Weeks</div>
      {!leaderboardRows && <LoadingSpinner />}
      {leaderboardRows?.length === 0 && (
        <div className={classes.noStats}>No stats yet.</div>
      )}
      {leaderboardRows && leaderboardRows.length > 0 && (
        <SbWeeklyLeaderboard
          rows={leaderboardRows}
          showWeekColumn
          showParlayColumn
        />
      )}
    </div>
  );
};
