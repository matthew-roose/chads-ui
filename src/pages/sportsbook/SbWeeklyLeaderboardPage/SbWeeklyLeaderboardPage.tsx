import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { WeekSelect } from "../../../components/WeekSelect/WeekSelect";
import { useSbGetWeeklyLeaderboard } from "../../../hooks/sportsbook/useSbGetWeeklyLeaderboard";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import classes from "./SbWeeklyLeaderboardPage.module.css";
import { SbWeeklyLeaderboard } from "../../../components/SbWeeklyLeaderboard/SbWeeklyLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const SbWeeklyLeaderboardPage = () => {
  const { weekNumber } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: weeklyLeaderboardData } = useSbGetWeeklyLeaderboard(
    weekNumber ? +weekNumber : currentWeekNumber
  );

  if (!currentWeekNumber || !weeklyLeaderboardData) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  if (!weekNumber || !allWeekNumbers.includes(weekNumber)) {
    return <div>Invalid week number in URL.</div>;
  }

  const getNavigateUrl = (weekNumber: string | null) => {
    if (!weekNumber) {
      return "/";
    }
    return `/sportsbook/leaderboard/week/${weekNumber}`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SB Week {weekNumber} Leaderboard</title>
      </Helmet>
      <WeekSelect
        weekNumber={weekNumber}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>Week {weekNumber} Leaderboard</div>
      <SbWeeklyLeaderboard
        rows={weeklyLeaderboardData}
        showWeekColumn={false}
        showParlayColumn={true}
      />
    </div>
  );
};
