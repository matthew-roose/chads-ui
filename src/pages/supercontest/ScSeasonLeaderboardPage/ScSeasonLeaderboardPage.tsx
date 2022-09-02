import { Helmet } from "react-helmet-async";
import { useScGetSeasonLeaderboard } from "../../../hooks/supercontest/useScGetSeasonLeaderboard";
import classes from "./ScSeasonLeaderboardPage.module.css";
import { ScLeaderboard } from "../../../components/ScLeaderboard/ScLeaderboard";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";

export const ScSeasonLeaderboardPage = () => {
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: seasonLeaderboardData } = useScGetSeasonLeaderboard();

  if (!currentWeekNumber || !seasonLeaderboardData) {
    return null;
  }

  const seasonLeaderboardRows = seasonLeaderboardData.map((entry) => {
    const { username, seasonScore, seasonWins, seasonLosses, seasonPushes } =
      entry;
    return {
      username,
      score: seasonScore,
      wins: seasonWins,
      losses: seasonLosses,
      pushes: seasonPushes,
    };
  });

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SC Season Leaderboard</title>
      </Helmet>
      <div className={classes.title}>Season Leaderboard</div>
      <ScLeaderboard
        rows={seasonLeaderboardRows}
        linkedWeekNumber={currentWeekNumber}
      />
    </div>
  );
};
