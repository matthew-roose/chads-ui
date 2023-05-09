import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Table } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { ChadContext } from "../../../store/chad-context";
import { useScGetSeasonMostPopular } from "../../../hooks/supercontest/useScGetSeasonMostPopular";
import { formatSpread } from "../../../util/format";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScMostPopularThisSeasonPage.module.css";

export const ScMostPopularThisSeasonPage = () => {
  const { useDarkMode } = useContext(ChadContext);
  const { data: seasonMostPopularData } = useScGetSeasonMostPopular();

  const mostPopularPickRows = seasonMostPopularData?.map((pick) => {
    const {
      weekNumber,
      pickedTeam,
      opposingTeam,
      homeTeam,
      timesPicked,
      homeSpread,
      homeScore,
      awayScore,
      result,
    } = pick;
    let pickedSpread;
    let pickedTeamScore;
    let opposingTeamScore;
    if (pickedTeam === homeTeam) {
      pickedSpread = homeSpread.toFixed(1);
      pickedTeamScore = homeScore;
      opposingTeamScore = awayScore;
    } else {
      pickedSpread = (homeSpread * -1).toFixed(1);
      pickedTeamScore = awayScore;
      opposingTeamScore = homeScore;
    }
    const gameScore =
      homeScore !== null ? `${pickedTeamScore}-${opposingTeamScore}` : "";
    let winLossFillClassName;
    let winLossTextClassName;
    if (result === Result.WIN) {
      winLossFillClassName = classes.winFill;
      winLossTextClassName = classes.winText;
    } else if (result === Result.LOSS) {
      winLossFillClassName = classes.lossFill;
      winLossTextClassName = classes.lossText;
    } else if (result === Result.PUSH) {
      winLossFillClassName = classes.pushFill;
      winLossTextClassName = classes.pushText;
    }
    return (
      <tr className={classes.row} key={weekNumber + pickedTeam}>
        <td className={classes.hideForMobile}>{weekNumber}</td>
        <td>
          <div
            className={`${classes.flexRow} ${
              classes.logoBackdrop
            } ${winLossFillClassName} ${useDarkMode ? classes.darkMode : ""}`}
          >
            <img
              className={classes.logo}
              src={AllTeamLogos[pickedTeam] as unknown as string}
              alt={pickedTeam}
            />
            <span className={classes.spread}>
              {formatSpread(+pickedSpread)}
            </span>
          </div>
        </td>
        <td>
          <img
            className={classes.logo}
            src={AllTeamLogos[opposingTeam] as unknown as string}
            alt={opposingTeam}
          />
        </td>
        <td>{timesPicked}</td>
        <td
          className={`${winLossTextClassName} ${
            useDarkMode ? classes.darkMode : ""
          }`}
        >
          {gameScore}
        </td>
        <td
          className={`${winLossTextClassName} ${
            useDarkMode ? classes.darkMode : ""
          } ${classes.hideForMobile}`}
        >
          {result}
        </td>
      </tr>
    );
  });

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Supercontest | Season's Most Popular</title>
      </Helmet>
      <div className={classes.title}>Most Popular Picks of the Season</div>
      {!seasonMostPopularData && <LoadingSpinner />}
      {mostPopularPickRows?.length === 0 && (
        <div className={classes.message}>No picks yet.</div>
      )}
      {mostPopularPickRows && mostPopularPickRows.length > 0 && (
        <Table striped highlightOnHover className={classes.table}>
          <thead>
            <tr>
              <th className={classes.hideForMobile}>Week</th>
              <th>Pick</th>
              <th>Opponent</th>
              <th>Count</th>
              <th>Score</th>
              <th className={classes.hideForMobile}>Result</th>
            </tr>
          </thead>
          <tbody>{mostPopularPickRows}</tbody>
        </Table>
      )}
    </div>
  );
};
