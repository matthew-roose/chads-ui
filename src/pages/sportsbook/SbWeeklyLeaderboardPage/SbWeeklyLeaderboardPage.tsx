import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { WeekSelect } from "../../../components/WeekSelect/WeekSelect";
import { useSbGetWeeklyLeaderboard } from "../../../hooks/sportsbook/useSbGetWeeklyLeaderboard";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { SbWeeklyLeaderboard } from "../../../components/SbWeeklyLeaderboard/SbWeeklyLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbWeeklyLeaderboardPage.module.css";

export const SbWeeklyLeaderboardPage = () => {
  const { weekNumber } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: weeklyLeaderboardData } = useSbGetWeeklyLeaderboard(
    weekNumber ? +weekNumber : currentWeekNumber
  );

  const allWeekNumbers = Array.from(
    { length: currentWeekNumber || 0 },
    (_, i) => (i + 1).toString()
  );

  const getNavigateUrl = (weekNumber: string | null) => {
    if (!weekNumber) {
      return "/";
    }
    return `/sportsbook/leaderboard/week/${weekNumber}`;
  };

  const isInvalidWeekNumber =
    !weekNumber || (currentWeekNumber && !allWeekNumbers.includes(weekNumber));

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | Week {weekNumber} Leaderboard</title>
      </Helmet>
      <WeekSelect
        weekNumber={weekNumber || ""}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      {!isInvalidWeekNumber && (
        <div className={classes.title}>Week {weekNumber} Leaderboard</div>
      )}
      {isInvalidWeekNumber && (
        <div className={classes.message}>Invalid week number in URL.</div>
      )}
      {!weeklyLeaderboardData && <LoadingSpinner />}
      {!isInvalidWeekNumber && weeklyLeaderboardData?.length === 0 && (
        <div className={classes.message}>No stats yet.</div>
      )}
      {weeklyLeaderboardData && weeklyLeaderboardData.length > 0 && (
        <SbWeeklyLeaderboard
          rows={weeklyLeaderboardData}
          showWeekColumn={false}
          showParlayColumn={true}
        />
      )}
    </div>
  );
};
