import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useScGetWeeklyLeaderboard } from "../../../hooks/supercontest/useScGetWeeklyLeaderboard";
import classes from "./ScWeeklyLeaderboardPage.module.css";
import { WeekSelect } from "../../../components/WeekSelect/WeekSelect";
import { ScLeaderboard } from "../../../components/ScLeaderboard/ScLeaderboard";

export const ScWeeklyLeaderboardPage = () => {
  const { weekNumber } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: weeklyLeaderboardData } = useScGetWeeklyLeaderboard(
    weekNumber ? +weekNumber : currentWeekNumber
  );

  if (!currentWeekNumber || !weeklyLeaderboardData) {
    return null;
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  if (!weekNumber || !allWeekNumbers.includes(weekNumber)) {
    return <div>Invalid week number in URL.</div>;
  }

  const weeklyLeaderboardRows = weeklyLeaderboardData.map((entryWeek) => {
    const { username, weekScore, weekWins, weekLosses, weekPushes } = entryWeek;
    return {
      username,
      score: weekScore,
      wins: weekWins,
      losses: weekLosses,
      pushes: weekPushes,
    };
  });

  const getNavigateUrl = (weekNumber: string | null) => {
    if (!weekNumber) {
      return "/";
    }
    return `/supercontest/leaderboard/week/${weekNumber}`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SC Week {weekNumber} Leaderboard</title>
      </Helmet>
      <WeekSelect
        weekNumber={weekNumber}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>Week {weekNumber} Leaderboard</div>
      <ScLeaderboard
        rows={weeklyLeaderboardRows}
        linkedWeekNumber={+weekNumber}
      />
    </div>
  );
};
