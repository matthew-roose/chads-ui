import { Helmet } from "react-helmet-async";
import { useSbGetSeasonLeaderboard } from "../../../hooks/sportsbook/useSbGetSeasonLeaderboard";
import { SbSeasonLeaderboard } from "../../../components/SbSeasonLeaderboard/SbSeasonLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbSeasonLeaderboardPage.module.css";

export const SbSeasonLeaderboardPage = () => {
  const { data: seasonLeaderboardData } = useSbGetSeasonLeaderboard();

  const seasonLeaderboardRows = seasonLeaderboardData
    ?.filter((user) => user.winLossTotal !== 0)
    .sort((a, b) => b.winLossTotal - a.winLossTotal);

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | Season Leaderboard</title>
      </Helmet>
      <div className={classes.title}>Season Leaderboard</div>
      {!seasonLeaderboardRows && <LoadingSpinner />}
      {seasonLeaderboardRows?.length === 0 && (
        <div className={classes.noStats}>No stats yet.</div>
      )}
      {seasonLeaderboardRows && seasonLeaderboardRows.length > 0 && (
        <SbSeasonLeaderboard rows={seasonLeaderboardRows} />
      )}
    </div>
  );
};
