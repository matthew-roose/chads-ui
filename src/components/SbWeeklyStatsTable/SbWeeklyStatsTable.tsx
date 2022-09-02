import { Table } from "@mantine/core";
import { Link } from "react-router-dom";
import { SbWeeklyUserStats } from "../../types/sportsbook/SbWeeklyUserStats";
import { formatCurrency, convertOddsFromDecimal } from "../../util/format";
import classes from "./SbWeeklyStatsTable.module.css";

interface SbWeeklyStatsTableProps {
  rows: SbWeeklyUserStats[];
}

export const SbWeeklyStatsTable = ({ rows }: SbWeeklyStatsTableProps) => {
  const statsRows = rows.map((row) => {
    const {
      weekNumber,
      username,
      amountWagered,
      amountWon,
      amountLost,
      profit,
      bestParlayOdds,
    } = row;
    const profitClass =
      profit > 0 ? classes.positive : profit < 0 ? classes.negative : "";
    // this component is used for both user and public weekly stats which link to different pages
    const linkUrl =
      username !== ""
        ? `/sportsbook/bet-history/${username}/week/${weekNumber}`
        : `/sportsbook/public-money/week/${weekNumber}`;
    return (
      <tr key={weekNumber} className={classes.leaderboardRow}>
        <td>
          <Link to={linkUrl}>{weekNumber}</Link>
        </td>
        <td className={profitClass}>{formatCurrency(profit, 0)}</td>
        <td>
          {bestParlayOdds ? convertOddsFromDecimal(bestParlayOdds) : "N/A"}
        </td>
        <td className={classes.hideForMobile}>
          {formatCurrency(amountWagered, 0)}
        </td>
        <td className={classes.hideForMobile}>
          {formatCurrency(amountWon, 0)}
        </td>
        <td className={classes.hideForMobile}>
          {formatCurrency(amountLost, 0)}
        </td>
      </tr>
    );
  });

  return (
    <Table striped highlightOnHover className={classes.table}>
      <thead>
        <tr>
          <th>Week</th>
          <th>Profit</th>
          <th>Best Parlay</th>
          <th className={classes.hideForMobile}>Wagered</th>
          <th className={classes.hideForMobile}>Won</th>
          <th className={classes.hideForMobile}>Lost</th>
        </tr>
      </thead>
      <tbody>{statsRows}</tbody>
    </Table>
  );
};
