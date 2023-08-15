import { Helmet } from "react-helmet-async";
import { SvLeaderboard } from "../../../components/SvLeaderboard/SvLeaderboard";
import { useSvGetLeaderboard } from "../../../hooks/survivor/useSvGetLeaderboard";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useContext } from "react";
import { ChadContext } from "../../../store/chad-context";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvLeaderboardPage.module.css";

export const SvLeaderboardPage = () => {
  const { googleJwt } = useContext(ChadContext);
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: leaderboardData } = useSvGetLeaderboard(googleJwt);

  const leaderboardRows = leaderboardData
    ?.filter((a) => a.picks.length > 0)
    .sort((a, b) => a.username.localeCompare(b.username))
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .sort((a, b) => a.losses - b.losses)
    .sort((a, b) => b.score - a.score);

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Survivor | Leaderboard</title>
      </Helmet>
      <div className={classes.title}>Survivor Leaderboard</div>
      {(!currentWeekNumber || !leaderboardData) && <LoadingSpinner />}
      {currentWeekNumber && leaderboardRows && (
        <SvLeaderboard
          rows={leaderboardRows}
          currentWeekNumber={currentWeekNumber}
        />
      )}
    </div>
  );
};
