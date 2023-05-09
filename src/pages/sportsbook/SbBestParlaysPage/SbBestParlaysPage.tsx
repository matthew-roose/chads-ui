import { Table } from "@mantine/core";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { useSbGetBestParlays } from "../../../hooks/sportsbook/useSbGetBestParlays";
import { ChadContext } from "../../../store/chad-context";
import { convertOddsFromDecimal, formatCurrency } from "../../../util/format";
import classes from "./SbBestParlaysPage.module.css";

export const SbBestParlaysPage = () => {
  const { username: loggedInUsername, useDarkMode } = useContext(ChadContext);
  const { data: bestParlaysData } = useSbGetBestParlays();

  const leaderboardRows = bestParlaysData?.map((week) => {
    const {
      id,
      username,
      weekNumber,
      wager,
      effectiveToWinAmount,
      effectiveOdds,
    } = week;
    const rowClasses = `${classes.leaderboardRow} ${
      username === loggedInUsername ? classes.loggedInRow : classes.otherRow
    } ${useDarkMode ? classes.darkMode : classes.lightMode}`;
    const parlayClasses = `${classes.parlayOdds} ${
      useDarkMode ? classes.darkMode : ""
    }`;
    return (
      <tr key={id} className={rowClasses}>
        <td>
          <Link to={`/sportsbook/bet-history/${username}/week/${weekNumber}`}>
            {username}
          </Link>
        </td>
        <td>{weekNumber}</td>
        <td className={parlayClasses}>
          {convertOddsFromDecimal(effectiveOdds)}
        </td>
        <td className={classes.hideForMobile}>{formatCurrency(wager, 0)}</td>
        <td className={classes.hideForMobile}>
          {formatCurrency(effectiveToWinAmount, 0)}
        </td>
      </tr>
    );
  });
  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | Best Parlays</title>
      </Helmet>
      <div className={classes.title}>Best Parlays</div>
      {!leaderboardRows && <LoadingSpinner />}
      {leaderboardRows?.length === 0 && (
        <div className={classes.noStats}>No stats yet.</div>
      )}
      {leaderboardRows && leaderboardRows.length > 0 && (
        <Table className={classes.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Week</th>
              <th>Odds</th>
              <th className={classes.hideForMobile}>Wager</th>
              <th className={classes.hideForMobile}>Win</th>
            </tr>
          </thead>
          <tbody>{leaderboardRows}</tbody>
        </Table>
      )}
    </div>
  );
};
