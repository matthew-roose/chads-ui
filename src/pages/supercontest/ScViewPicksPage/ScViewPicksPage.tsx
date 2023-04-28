import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Group, Table } from "@mantine/core";
import { ScViewPicksGame } from "../../../components/ScViewPicksGame/ScViewPicksGame";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useScGetUserEntryWeekAndNullablePicks } from "../../../hooks/supercontest/useScGetUserEntryWeekAndNullablePicks";
import { AuthContext } from "../../../store/auth-context";
import {
  formatRecord,
  formatUsernamePossessiveForm,
} from "../../../util/format";
import { UserAndWeekSelects } from "../../../components/UserAndWeekSelects/UserAndWeekSelects";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScViewPicksPage.module.css";

export const ScViewPicksPage = () => {
  const { googleJwt } = useContext(AuthContext);
  const { username, weekNumber } = useParams();

  const { data: allUsernames } = useGetAllUsernames();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();

  const { data: entryWeekData } = useScGetUserEntryWeekAndNullablePicks(
    googleJwt,
    username,
    weekNumber ? +weekNumber : currentWeekNumber
  );

  if (!allUsernames || !currentWeekNumber) {
    return <LoadingSpinner type="primary" />;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div>Invalid username in URL.</div>;
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  if (!weekNumber || !allWeekNumbers.includes(weekNumber)) {
    return <div>Invalid week number in URL.</div>;
  }

  const picksLogos = entryWeekData?.picks
    .filter((pick) => pick.pickedTeam)
    .map((pick) => {
      const picksLogoClasses = `${classes.pickLogo} ${
        pick.result
          ? pick.result === Result.WIN
            ? classes.win
            : pick.result === Result.LOSS
            ? classes.loss
            : pick.result === Result.PUSH
            ? classes.push
            : ""
          : ""
      }`;
      if (!pick.pickedTeam) {
        return null;
      }
      return (
        <img
          key={pick.pickedTeam}
          className={picksLogoClasses}
          src={AllTeamLogos[pick.pickedTeam] as unknown as string}
          alt={pick.pickedTeam}
        />
      );
    });

  const picks = entryWeekData?.picks.map((pick) => (
    <ScViewPicksGame key={pick.gameId || Math.random()} {...pick} />
  ));

  const getNavigateUrl = (
    username: string | null,
    weekNumber: string | null
  ) => {
    if (!username || !weekNumber) {
      return "/";
    }
    return `/supercontest/pick-history/${username}/week/${weekNumber}`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | {formatUsernamePossessiveForm(username)} Week {weekNumber} SC
          Picks
        </title>
      </Helmet>
      <UserAndWeekSelects
        username={username}
        allUsernames={allUsernames}
        weekNumber={weekNumber}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      {!entryWeekData && <LoadingSpinner type="secondary" />}
      {entryWeekData && (
        <>
          <Group className={classes.pickLogoGroup} position="center">
            {picksLogos}
          </Group>
          {entryWeekData.picks.length > 0 && (
            <div className={classes.title}>
              Week {weekNumber}:{" "}
              {formatRecord(
                entryWeekData.weekWins,
                entryWeekData.weekLosses,
                entryWeekData.weekPushes
              )}
            </div>
          )}
          {entryWeekData.picks.length === 0 && (
            <div className={classes.noPicks}>No picks.</div>
          )}
          {entryWeekData.picks.length > 0 && (
            <Table className={classes.table}>
              <thead>
                <tr>
                  <th></th>
                  <th className={classes.hideForMobile}></th>
                </tr>
              </thead>
              <tbody>{picks}</tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};
