import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useScGetUserPickStats } from "../../../hooks/supercontest/useScGetUserPickStats";
import { formatUsernamePossessiveForm } from "../../../util/format";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { ScPickedAndFadedTable } from "../../../components/ScPickedAndFadedTable/ScPickedAndFadedTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScMostPickedTeamsPage.module.css";

export const ScMostPickedTeamsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: mostPickedTeamsData } = useScGetUserPickStats(username);

  if (!allUsernames) {
    return <LoadingSpinner type="primary" />;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div>Invalid username in URL.</div>;
  }

  const teamRows = mostPickedTeamsData?.map((team) => {
    const { pickedTeam, total, wins, losses, pushes } = team;
    return { team: pickedTeam, total, wins, losses, pushes };
  });

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/supercontest/${username}/stats/most-picked`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | Supercontest | {formatUsernamePossessiveForm(username)} Most
          Picked Teams
        </title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        {formatUsernamePossessiveForm(username)} Most Picked Teams
      </div>
      {!mostPickedTeamsData && <LoadingSpinner type="secondary" />}
      {teamRows && <ScPickedAndFadedTable rows={teamRows} />}
    </div>
  );
};
