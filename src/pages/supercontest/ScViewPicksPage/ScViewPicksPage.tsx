import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SimpleGrid } from "@mantine/core";
import { ScViewPicksGame } from "../../../components/ScViewPicksGame/ScViewPicksGame";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useScGetUserEntryWeekAndNullablePicks } from "../../../hooks/supercontest/useScGetUserEntryWeekAndNullablePicks";
import { AuthContext } from "../../../store/auth-context";
import {
  formatRecord,
  formatUsernamePossessiveForm,
} from "../../../util/format";
import classes from "./ScViewPicksPage.module.css";
import { UserAndWeekSelects } from "../../../components/UserAndWeekSelects/UserAndWeekSelects";

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

  if (!allUsernames || !currentWeekNumber || !entryWeekData) {
    return null;
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

  const picks = entryWeekData.picks.map((pick) => (
    <ScViewPicksGame key={pick.gameId} {...pick} />
  ));
  const { weekWins, weekLosses, weekPushes } = entryWeekData;
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
      {entryWeekData.picks.length > 0 && (
        <div className={classes.title}>
          Week {weekNumber}: {formatRecord(weekWins, weekLosses, weekPushes)}
        </div>
      )}
      {entryWeekData.picks.length === 0 && (
        <div className={classes.noPicks}>No picks.</div>
      )}
      <SimpleGrid
        p="xl"
        cols={2}
        spacing={20}
        breakpoints={[{ maxWidth: 1000, cols: 1 }]}
      >
        {picks}
      </SimpleGrid>
    </div>
  );
};
