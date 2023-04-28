import { Helmet } from "react-helmet-async";
import { SvLeaderboard } from "../../../components/SvLeaderboard/SvLeaderboard";
import { useSvGetLeaderboard } from "../../../hooks/survivor/useSvGetLeaderboard";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import classes from "./SvLeaderboardPage.module.css";
import { useContext } from "react";
import { AuthContext } from "../../../store/auth-context";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const SvLeaderboardPage = () => {
  const { googleJwt } = useContext(AuthContext);
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: leaderboardData } = useSvGetLeaderboard(googleJwt);

  if (!currentWeekNumber || !leaderboardData) {
    return <LoadingSpinner type="primary" />;
  }

  const leaderboardRows = leaderboardData
    .sort((a, b) => a.username.localeCompare(b.username))
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .sort((a, b) => a.losses - b.losses)
    .sort((a, b) => b.score - a.score);

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SV Leaderboard</title>
      </Helmet>
      <div className={classes.title}>Leaderboard</div>
      <SvLeaderboard
        rows={leaderboardRows}
        currentWeekNumber={currentWeekNumber}
      />
    </div>
  );
};
