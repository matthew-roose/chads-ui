import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Table } from "@mantine/core";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useScGetAllUserEntryWeeks } from "../../../hooks/supercontest/useScGetAllUserEntryWeeks";
import {
  calculateWinPct,
  formatRecord,
  formatUsernamePossessiveForm,
} from "../../../util/format";
import classes from "./ScWeeklyUserStatsPage.module.css";
import { UserSelect } from "../../../components/UserSelect/UserSelect";

export const ScWeeklyUserStatsPage = () => {
  const { username } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: entryAndEntryWeeksData } = useScGetAllUserEntryWeeks(username);

  if (!currentWeekNumber || !allUsernames || !entryAndEntryWeeksData) {
    return null;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div>Invalid username in URL.</div>;
  }

  const entryWeeksSoFar = entryAndEntryWeeksData.supercontestEntryWeeks.slice(
    0,
    currentWeekNumber
  );
  const weeklyDataRows = entryWeeksSoFar.map((entryWeek) => {
    const { weekNumber, weekScore, weekWins, weekLosses, weekPushes } =
      entryWeek;
    const winPct = calculateWinPct(weekWins, weekLosses, weekPushes);
    const recordClass =
      weekWins - weekLosses > 0
        ? classes.positive
        : weekWins - weekLosses < 0
        ? classes.negative
        : "";
    return (
      <tr key={weekNumber} className={classes.leaderboardRow}>
        <td>
          <Link
            to={`/supercontest/pick-history/${username}/week/${weekNumber}`}
          >
            {weekNumber}
          </Link>
        </td>
        <td className={recordClass}>
          {formatRecord(weekWins, weekLosses, weekPushes)}
        </td>
        <td>{weekScore.toFixed(1)}</td>
        <td className={recordClass}>{winPct ? `${winPct}%` : "N/A"}</td>
      </tr>
    );
  });
  const { seasonWins, seasonLosses, seasonPushes } = entryAndEntryWeeksData;
  const seasonRecord = formatRecord(seasonWins, seasonLosses, seasonPushes);
  const winPct = calculateWinPct(seasonWins, seasonLosses, seasonPushes);

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/supercontest/${username}/stats/weekly`;
  };

  const recordClass =
    seasonWins - seasonLosses > 0
      ? classes.positive
      : seasonWins - seasonLosses < 0
      ? classes.negative
      : "";

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | {formatUsernamePossessiveForm(username)} Weekly Stats
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
      <div className={`${classes.seasonRecord} ${recordClass}`}>
        Season: {seasonRecord} {winPct ? `(${winPct}%)` : ""}
      </div>
      <Table striped highlightOnHover className={classes.table}>
        <thead>
          <tr>
            <th>Week number</th>
            <th>Record</th>
            <th>Points</th>
            <th>Win pct.</th>
          </tr>
        </thead>
        <tbody>{weeklyDataRows}</tbody>
      </Table>
    </div>
  );
};
