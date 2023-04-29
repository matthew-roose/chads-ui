import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useScGetUserFadeStats } from "../../../hooks/supercontest/useScGetUserFadeStats";
import { formatUsernamePossessiveForm } from "../../../util/format";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { ScPickedAndFadedTable } from "../../../components/ScPickedAndFadedTable/ScPickedAndFadedTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScMostFadedTeamsPage.module.css";

export const ScMostFadedTeamsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: mostFadedTeamsData } = useScGetUserFadeStats(username);

  if (!allUsernames) {
    return <LoadingSpinner type="primary" />;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div>Invalid username in URL.</div>;
  }

  const teamRows = mostFadedTeamsData?.map((team) => {
    const { fadedTeam, total, wins, losses, pushes } = team;
    return { team: fadedTeam, total, wins, losses, pushes };
  });

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/supercontest/${username}/stats/most-faded`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | Supercontest | {formatUsernamePossessiveForm(username)} Most
          Faded Teams
        </title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        {formatUsernamePossessiveForm(username)} Most Faded Teams
      </div>
      {!mostFadedTeamsData && <LoadingSpinner type="secondary" />}
      {teamRows && <ScPickedAndFadedTable rows={teamRows} />}
    </div>
  );
};
