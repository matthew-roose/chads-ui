import { Table } from "@mantine/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import { SbWeeklyUserStats } from "../../types/sportsbook/SbWeeklyUserStats";
import { formatCurrency, convertOddsFromDecimal } from "../../util/format";
import classes from "./SbWeeklyLeaderboard.module.css";

interface SbWeeklyLeaderboardProps {
  rows: SbWeeklyUserStats[];
  showWeekColumn: boolean;
  showParlayColumn: boolean;
}

export const SbWeeklyLeaderboard = ({
  rows,
  showWeekColumn,
  showParlayColumn,
}: SbWeeklyLeaderboardProps) => {
  const { username: loggedInUsername } = useContext(AuthContext);

  const leaderboardRows = rows.map((week) => {
    const {
      weekNumber,
      username,
      amountWagered,
      amountWon,
      amountLost,
      profit,
      bestParlayOdds,
    } = week;
    const rowClasses = `${classes.leaderboardRow} ${
      username === loggedInUsername ? classes.loggedInRow : classes.otherRow
    }`;
    const profitClass =
      profit > 0 ? classes.positive : profit < 0 ? classes.negative : "";
    return (
      <tr key={weekNumber + username} className={rowClasses}>
        <td>
          <Link to={`/sportsbook/bet-history/${username}/week/${weekNumber}`}>
            {username}
          </Link>
        </td>
        {showWeekColumn && <td>{weekNumber}</td>}
        <td className={profitClass}>{formatCurrency(profit, 0)}</td>
        {showParlayColumn && (
          <td>
            {bestParlayOdds ? convertOddsFromDecimal(bestParlayOdds) : "N/A"}
          </td>
        )}
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
    <Table className={classes.table}>
      <thead>
        <tr>
          <th>Username</th>
          {showWeekColumn && <th>Week</th>}
          <th>Profit</th>
          {showParlayColumn && <th>Best Parlay</th>}
          <th className={classes.hideForMobile}>Wagered</th>
          <th className={classes.hideForMobile}>Won</th>
          <th className={classes.hideForMobile}>Lost</th>
        </tr>
      </thead>
      <tbody>{leaderboardRows}</tbody>
    </Table>
  );
};
