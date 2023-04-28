import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { useSbGetAllWeeklyUserStats } from "../../../hooks/sportsbook/useSbGetAllWeeklyUserStats";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { formatUsernamePossessiveForm } from "../../../util/format";
import classes from "./SbWeeklyUserStatsPage.module.css";
import { SbWeeklyStatsTable } from "../../../components/SbWeeklyStatsTable/SbWeeklyStatsTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const SbWeeklyUserStatsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: weeklyUserStatsData } = useSbGetAllWeeklyUserStats(username);

  if (!allUsernames) {
    return <LoadingSpinner type="primary" />;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div>Invalid username in URL.</div>;
  }

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/sportsbook/${username}/stats/weekly`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | {formatUsernamePossessiveForm(username)} SB Weekly Stats
        </title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        {formatUsernamePossessiveForm(username)} Weekly Stats
      </div>
      {!weeklyUserStatsData && <LoadingSpinner type="secondary" />}
      {weeklyUserStatsData && <SbWeeklyStatsTable rows={weeklyUserStatsData} />}
    </div>
  );
};
