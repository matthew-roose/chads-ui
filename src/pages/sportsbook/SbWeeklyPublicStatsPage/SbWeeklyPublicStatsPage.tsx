import { Helmet } from "react-helmet-async";
import { useSbGetPublicWeeklyStats } from "../../../hooks/sportsbook/useSbGetPublicWeeklyStats";
import { SbWeeklyStatsTable } from "../../../components/SbWeeklyStatsTable/SbWeeklyStatsTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbWeeklyPublicStatsPage.module.css";

export const SbWeeklyPublicStatsPage = () => {
  const { data: weeklyPublicStatsData } = useSbGetPublicWeeklyStats();

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | Public Weekly Stats</title>
      </Helmet>
      <div className={classes.title}>Public Weekly Stats</div>
      {!weeklyPublicStatsData && <LoadingSpinner />}
      {weeklyPublicStatsData?.length === 0 && (
        <div className={classes.noStats}>No stats yet.</div>
      )}
      {weeklyPublicStatsData !== undefined &&
        weeklyPublicStatsData.length > 0 && (
          <SbWeeklyStatsTable rows={weeklyPublicStatsData} />
        )}
    </div>
  );
};
