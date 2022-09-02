import { Helmet } from "react-helmet-async";
import { useSbGetSeasonLeaderboard } from "../../../hooks/sportsbook/useSbGetSeasonLeaderboard";
import classes from "./SbSeasonLeaderboardPage.module.css";
import { SbSeasonLeaderboard } from "../../../components/SbSeasonLeaderboard/SbSeasonLeaderboard";

export const SbSeasonLeaderboardPage = () => {
  const { data: seasonLeaderboardData } = useSbGetSeasonLeaderboard();

  if (!seasonLeaderboardData) {
    return null;
  }

  const seasonLeaderboardRows = seasonLeaderboardData.sort(
    (a, b) => b.winLossTotal - a.winLossTotal
  );

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SB Season Leaderboard</title>
      </Helmet>
      <div className={classes.title}>Season Leaderboard</div>
      <SbSeasonLeaderboard rows={seasonLeaderboardRows} />
    </div>
  );
};
