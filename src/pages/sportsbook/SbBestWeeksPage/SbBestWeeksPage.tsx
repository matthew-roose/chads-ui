import { Helmet } from "react-helmet-async";
import { useSbGetBestWeeks } from "../../../hooks/sportsbook/useSbGetBestWeeks";
import classes from "./SbBestWeeksPage.module.css";
import { SbWeeklyLeaderboard } from "../../../components/SbWeeklyLeaderboard/SbWeeklyLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const SbBestWeeksPage = () => {
  const { data: bestWeeksData } = useSbGetBestWeeks();

  if (!bestWeeksData) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  const leaderboardRows = bestWeeksData.filter((week) => week.profit > 0);

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Best SB Weeks</title>
      </Helmet>
      <div className={classes.title}>Biggest Winning Weeks</div>
      <SbWeeklyLeaderboard
        rows={leaderboardRows}
        showWeekColumn
        showParlayColumn
      />
    </div>
  );
};
