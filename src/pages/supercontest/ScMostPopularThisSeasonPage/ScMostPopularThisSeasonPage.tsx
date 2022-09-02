import { Helmet } from "react-helmet-async";
import { Table } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { useScGetSeasonMostPopular } from "../../../hooks/supercontest/useScGetSeasonMostPopular";
import { formatSpread } from "../../../util/format";
import classes from "./ScMostPopularThisSeasonPage.module.css";
import { Result } from "../../../types/Result";

export const ScMostPopularThisSeasonPage = () => {
  const { data: seasonMostPopularData } = useScGetSeasonMostPopular();
  if (!seasonMostPopularData) {
    return null;
  }
  const mostPopularPickRows = seasonMostPopularData.map((pick) => {
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
    const resultClassName = result
      ? result === Result.WIN
        ? classes.win
        : result === Result.LOSS
        ? classes.loss
        : classes.push
      : "";
    return (
      <tr className={classes.row} key={weekNumber + pickedTeam}>
        <td>{weekNumber}</td>
        <td>
          <img
            className={classes.logo}
            src={AllTeamLogos[pickedTeam] as unknown as string}
            alt={pickedTeam}
          />
        </td>
        <td className={classes.hideForMobile}>
          <img
            className={classes.logo}
            src={AllTeamLogos[opposingTeam] as unknown as string}
            alt={opposingTeam}
          />
        </td>
        <td>{timesPicked}</td>
        <td>{formatSpread(+pickedSpread)}</td>
        <td className={classes.hideForMobile}>{gameScore}</td>
        <td className={resultClassName}>{result}</td>
      </tr>
    );
  });

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SC Season Most Popular</title>
      </Helmet>
      <div className={classes.title}>Most Popular Picks of the Season</div>
      <Table striped highlightOnHover className={classes.table}>
        <thead>
          <tr>
            <th>Week</th>
            <th>Team</th>
            <th className={classes.hideForMobile}>Opponent</th>
            <th>Count</th>
            <th>Spread</th>
            <th className={classes.hideForMobile}>Score</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>{mostPopularPickRows}</tbody>
      </Table>
    </div>
  );
};
