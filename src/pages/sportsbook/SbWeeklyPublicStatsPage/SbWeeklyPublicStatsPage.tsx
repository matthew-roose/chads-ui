import { Helmet } from "react-helmet-async";
import { useSbGetPublicWeeklyStats } from "../../../hooks/sportsbook/useSbGetPublicWeeklyStats";
import classes from "./SbWeeklyPublicStatsPage.module.css";
import { SbWeeklyStatsTable } from "../../../components/SbWeeklyStatsTable/SbWeeklyStatsTable";

export const SbWeeklyPublicStatsPage = () => {
  const { data: weeklyPublicStatsData } = useSbGetPublicWeeklyStats();

  if (!weeklyPublicStatsData) {
    return null;
  }

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SB Public Weekly Stats</title>
      </Helmet>
      <div className={classes.title}>Public Weekly Stats</div>
      <SbWeeklyStatsTable rows={weeklyPublicStatsData} />
    </div>
  );
};
