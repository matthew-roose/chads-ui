import { Table } from "@mantine/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ChadContext } from "../../store/chad-context";
import { calculateWinPct, formatRecord } from "../../util/format";
import classes from "./ScLeaderboard.module.css";

interface ScLeaderboardRow {
  username: string;
  score: number;
  wins: number;
  losses: number;
  pushes: number;
}

interface ScLeaderboardProps {
  rows: ScLeaderboardRow[];
  linkedWeekNumber: number;
}

export const ScLeaderboard = ({
  rows,
  linkedWeekNumber,
}: ScLeaderboardProps) => {
  const { username: loggedInUsername, useDarkMode } = useContext(ChadContext);
  const leaderboardRows = rows.map((entry) => {
    const { username, score, wins, losses, pushes } = entry;
    const winPct = calculateWinPct(wins, losses, pushes);
    const rowClasses = `${classes.leaderboardRow} ${
      username === loggedInUsername ? classes.loggedInRow : classes.otherRow
    } ${useDarkMode ? classes.darkMode : classes.lightMode}`;
    const recordClasses = `${
      wins - losses > 0
        ? classes.positive
        : wins - losses < 0
        ? classes.negative
        : ""
    } ${useDarkMode ? classes.darkMode : ""}`;
    return (
      <tr className={rowClasses} key={username}>
        <td>
          <Link
            to={`/supercontest/pick-history/${username}/week/${linkedWeekNumber}`}
          >
            {username}
          </Link>
        </td>
        <td className={recordClasses}>{formatRecord(wins, losses, pushes)}</td>
        <td>{score.toFixed(1)}</td>
        <td className={recordClasses}>{winPct ? `${winPct}%` : "N/A"}</td>
      </tr>
    );
  });

  return (
    <Table className={classes.table}>
      <thead>
        <tr>
          <th>Username</th>
          <th>Record</th>
          <th>Points</th>
          <th>Win pct.</th>
        </tr>
      </thead>
      <tbody>{leaderboardRows}</tbody>
    </Table>
  );
};
