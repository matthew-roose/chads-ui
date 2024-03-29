import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ChadContext } from "../../store/chad-context";
import { SvEntryAndNullablePicks } from "../../types/survivor/SvEntryAndNullablePicks";
import { formatRecord } from "../../util/format";
import { Button, ScrollArea, Table } from "@mantine/core";
import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../../types/Result";
import classes from "./SvLeaderboard.module.css";

interface SvLeaderboardProps {
  rows: SvEntryAndNullablePicks[];
  currentWeekNumber: number;
}

export const SvLeaderboard = ({
  rows,
  currentWeekNumber,
}: SvLeaderboardProps) => {
  const { username: loggedInUsername, useDarkMode } = useContext(ChadContext);
  const [viewAllPicks, setViewAllPicks] = useState(false);

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  const leaderboardRows = rows.map((entry) => {
    const { username, wins, losses, pushes, currentStreak, picks } = entry;
    const rowClasses = `${classes.leaderboardRow} ${
      username === loggedInUsername ? classes.loggedInRow : classes.otherRow
    } ${useDarkMode ? classes.darkMode : classes.lightMode}`;
    const currentPick = picks.find(
      (pick) => pick.weekNumber === currentWeekNumber
    );

    const picksToMap = viewAllPicks
      ? allWeekNumbers.map((weekNumber) => {
          const weekPick = picks.find(
            (pick) => pick.weekNumber === +weekNumber
          );
          if (!weekPick) {
            return null;
          }
          return weekPick;
        })
      : [currentPick];

    return (
      <tr className={rowClasses} key={username}>
        <td>
          <Link to={`/survivor/pick-history/${username}`}>{username}</Link>
        </td>
        <td>{formatRecord(wins, losses, pushes)}</td>
        <td>{currentStreak}</td>
        {picksToMap.map((pick) => {
          if (!pick) {
            return <td key={Math.random()} />;
          }
          let winLossClassName;
          if (pick.result === Result.WIN) {
            winLossClassName = classes.win;
          } else if (pick.result === Result.LOSS) {
            winLossClassName = classes.loss;
          } else if (pick.result === Result.PUSH) {
            winLossClassName = classes.push;
          }
          return (
            <td key={pick.weekNumber}>
              {pick.pickedTeam !== null && (
                <div className={`${classes.logoBackdrop} ${winLossClassName}`}>
                  <img
                    className={classes.logo}
                    src={AllTeamLogos[pick.pickedTeam] as unknown as string}
                    alt={pick.pickedTeam}
                  />
                </div>
              )}
              {pick.pickedTeam === null && (
                <div
                  className={classes.logoBackdrop}
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <img
                    className={`${classes.logo} ${classes.hiddenLogo}`}
                    src={require("../../assets/mystery_team.png")}
                    alt="Mystery Team"
                  />
                </div>
              )}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <>
      <Button
        onClick={() => setViewAllPicks(!viewAllPicks)}
        variant="gradient"
        gradient={{ from: "orange", to: "crimson" }}
        className={classes.button}
      >
        {viewAllPicks ? "Show only current pick" : "Show all picks"}
      </Button>
      <ScrollArea>
        <Table className={classes.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Record</th>
              <th>Streak</th>
              {viewAllPicks ? (
                allWeekNumbers.map((weekNumber) => (
                  <th key={weekNumber}>W{weekNumber}</th>
                ))
              ) : (
                <th>W{currentWeekNumber}</th>
              )}
            </tr>
          </thead>
          <tbody>{leaderboardRows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
};
