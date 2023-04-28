import { Table } from "@mantine/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { useGetCurrentWeekNumber } from "../../hooks/useGetCurrentWeekNumber";
import { AuthContext } from "../../store/auth-context";
import { SbAccount } from "../../types/sportsbook/SbAccount";
import { formatCurrency, convertOddsFromDecimal } from "../../util/format";
import classes from "./SbSeasonLeaderboard.module.css";

interface SbSeasonLeaderboardProps {
  rows: SbAccount[];
}
export const SbSeasonLeaderboard = ({ rows }: SbSeasonLeaderboardProps) => {
  const { username: loggedInUsername } = useContext(AuthContext);
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();

  if (!currentWeekNumber) {
    return <LoadingSpinner type="primary" />;
  }

  const leaderboardRows = rows.map((account) => {
    const {
      username,
      availableBalance,
      pendingBalance,
      depositTotal,
      cashOutTotal,
      winLossTotal,
      bestParlayOdds,
    } = account;
    const rowClasses = `${classes.leaderboardRow} ${
      username === loggedInUsername ? classes.loggedInRow : classes.otherRow
    }`;
    const winTotalClass =
      winLossTotal > 0
        ? classes.positive
        : winLossTotal < 0
        ? classes.negative
        : "";
    return (
      <tr key={username} className={rowClasses}>
        <td>
          <Link
            to={`/sportsbook/bet-history/${username}/week/${currentWeekNumber}`}
          >
            {username}
          </Link>
        </td>
        <td className={winTotalClass}>{formatCurrency(winLossTotal, 0)}</td>
        <td>
          {bestParlayOdds ? convertOddsFromDecimal(bestParlayOdds) : "N/A"}
        </td>
        <td>{formatCurrency(availableBalance + pendingBalance, 0)}</td>
        <td className={classes.hideForMobile}>
          {formatCurrency(depositTotal, 0)}
        </td>
        <td className={classes.hideForMobile}>
          {formatCurrency(cashOutTotal, 0)}
        </td>
      </tr>
    );
  });

  return (
    <Table className={classes.table}>
      <thead>
        <tr>
          <th>Username</th>
          <th>Profit</th>
          <th>Best Parlay</th>
          <th>Balance</th>
          <th className={classes.hideForMobile}>Deposits</th>
          <th className={classes.hideForMobile}>Cashouts</th>
        </tr>
      </thead>
      <tbody>{leaderboardRows}</tbody>
    </Table>
  );
};
