import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { useSbGetAllWeeklyUserStats } from "../../../hooks/sportsbook/useSbGetAllWeeklyUserStats";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { formatUsernamePossessiveForm } from "../../../util/format";
import { SbWeeklyStatsTable } from "../../../components/SbWeeklyStatsTable/SbWeeklyStatsTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbWeeklyUserStatsPage.module.css";

export const SbWeeklyUserStatsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: weeklyUserStatsData } = useSbGetAllWeeklyUserStats(username);

  // if (!allUsernames) {
  //   return <LoadingSpinner />;
  // }

  // if (!username || !allUsernames.includes(username)) {
  //   return <div>Invalid username in URL.</div>;
  // }

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/sportsbook/${username}/stats/weekly`;
  };

  const isInvalidUsername =
    !username || (allUsernames && !allUsernames.includes(username));

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | Sportsbook | {formatUsernamePossessiveForm(username || "")}{" "}
          Weekly Stats
        </title>
      </Helmet>
      <UserSelect
        username={username || ""}
        allUsernames={allUsernames || []}
        getNavigateUrl={getNavigateUrl}
      />
      {!isInvalidUsername && (
        <div className={classes.title}>
          {formatUsernamePossessiveForm(username || "")} Weekly Stats
        </div>
      )}
      {isInvalidUsername && (
        <div className={classes.message}>Invalid username in URL.</div>
      )}
      {!weeklyUserStatsData && <LoadingSpinner />}
      {!isInvalidUsername && weeklyUserStatsData?.length === 0 && (
        <div className={classes.message}>No stats yet.</div>
      )}
      {weeklyUserStatsData && weeklyUserStatsData.length > 0 && (
        <SbWeeklyStatsTable rows={weeklyUserStatsData} />
      )}
    </div>
  );
};
