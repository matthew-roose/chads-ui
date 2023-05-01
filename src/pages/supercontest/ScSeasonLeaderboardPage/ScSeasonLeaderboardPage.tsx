import { Helmet } from "react-helmet-async";
import { useScGetSeasonLeaderboard } from "../../../hooks/supercontest/useScGetSeasonLeaderboard";
import { ScLeaderboard } from "../../../components/ScLeaderboard/ScLeaderboard";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScSeasonLeaderboardPage.module.css";

export const ScSeasonLeaderboardPage = () => {
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: seasonLeaderboardData } = useScGetSeasonLeaderboard();

  const seasonLeaderboardRows = seasonLeaderboardData
    ?.sort((a, b) => a.username.localeCompare(b.username))
    .sort((a, b) => a.seasonLosses - b.seasonLosses)
    .sort((a, b) => b.seasonScore - a.seasonScore)
    .map((entry) => {
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
        <title>Chad's | Supercontest | Season Leaderboard</title>
      </Helmet>
      <div className={classes.title}>Season Leaderboard</div>
      {(!currentWeekNumber || !seasonLeaderboardData) && <LoadingSpinner />}
      {currentWeekNumber && seasonLeaderboardRows && (
        <ScLeaderboard
          rows={seasonLeaderboardRows}
          linkedWeekNumber={currentWeekNumber}
        />
      )}
    </div>
  );
};
