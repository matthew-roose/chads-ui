import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Table } from "@mantine/core";
import { ChadContext } from "../../../store/chad-context";
import { useScGetPublicEntryWeeks } from "../../../hooks/supercontest/useScGetPublicEntryWeeks";
import { calculateWinPct, formatRecord } from "../../../util/format";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScPublicRecordPage.module.css";

export const ScPublicRecordPage = () => {
  const { useDarkMode } = useContext(ChadContext);
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: publicEntryWeeksData } = useScGetPublicEntryWeeks();

  let seasonWins = 0;
  let seasonLosses = 0;
  let seasonPushes = 0;

  const entryWeeksSoFar = publicEntryWeeksData?.slice(0, currentWeekNumber);

  const rows = entryWeeksSoFar?.map((week) => {
    const { weekNumber, weekWins, weekLosses, weekPushes } = week;
    seasonWins += weekWins;
    seasonLosses += weekLosses;
    seasonPushes += weekPushes;
    const winPct = calculateWinPct(weekWins, weekLosses, weekPushes);
    const recordClasses = `${
      weekWins - weekLosses > 0
        ? classes.positive
        : weekWins - weekLosses < 0
        ? classes.negative
        : ""
    } ${useDarkMode ? classes.darkMode : ""}`;
    return (
      <tr className={classes.row} key={weekNumber}>
        <td>{weekNumber}</td>
        <td className={classes.recordClass}>
          {formatRecord(weekWins, weekLosses, weekPushes)}
        </td>
        <td className={recordClasses}>{winPct ? `${winPct}%` : "N/A"}</td>
      </tr>
    );
  });

  const seasonRecord = formatRecord(seasonWins, seasonLosses, seasonPushes);
  const winPct = calculateWinPct(seasonWins, seasonLosses, seasonPushes);

  const recordClasses = `${
    seasonWins - seasonLosses > 0
      ? classes.positive
      : seasonWins - seasonLosses < 0
      ? classes.negative
      : ""
  } ${useDarkMode ? classes.darkMode : ""}`;

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Supercontest | Public Record</title>
      </Helmet>
      <div className={classes.title}>Public Record</div>
      {!publicEntryWeeksData && <LoadingSpinner />}
      {publicEntryWeeksData && (
        <>
          <div className={`${classes.seasonRecord} ${recordClasses}`}>
            Season: {seasonRecord} {winPct ? `(${winPct}%)` : ""}
          </div>
          <Table striped highlightOnHover className={classes.table}>
            <thead>
              <tr>
                <th>Week number</th>
                <th>Record</th>
                <th>Win pct.</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </>
      )}
    </div>
  );
};
