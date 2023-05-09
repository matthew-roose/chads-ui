import { useContext } from "react";
import { Table } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { ChadContext } from "../../../store/chad-context";
import { useSvGetSeasonMostPopular } from "../../../hooks/survivor/useSvGetSeasonMostPopular";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvMostPopularThisSeasonPage.module.css";

export const SvMostPopularThisSeasonPage = () => {
  const { useDarkMode } = useContext(ChadContext);
  const { data: seasonMostPopularData } = useSvGetSeasonMostPopular();

  const mostPopularPickRows = seasonMostPopularData?.map((pick) => {
    const {
      weekNumber,
      pickedTeam,
      opposingTeam,
      homeTeam,
      timesPicked,
      homeScore,
      awayScore,
      result,
    } = pick;
    let pickedTeamScore;
    let opposingTeamScore;
    if (pickedTeam === homeTeam) {
      pickedTeamScore = homeScore;
      opposingTeamScore = awayScore;
    } else {
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
        <td>{weekNumber}</td>
        <td>
          <div className={`${classes.logoBackdrop} ${winLossFillClassName}`}>
            <img
              className={classes.logo}
              src={AllTeamLogos[pickedTeam] as unknown as string}
              alt={pickedTeam}
            />
          </div>
        </td>
        <td>
          <div>
            <img
              className={classes.logo}
              src={AllTeamLogos[opposingTeam] as unknown as string}
              alt={opposingTeam}
            />
          </div>
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
        <title>Chad's | Survivor | Season's Most Popular</title>
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
              <th>Week</th>
              <th>Team</th>
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
