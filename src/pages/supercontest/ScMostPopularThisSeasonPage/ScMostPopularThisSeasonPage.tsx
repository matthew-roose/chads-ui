import { Helmet } from "react-helmet-async";
import { Table } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { useScGetSeasonMostPopular } from "../../../hooks/supercontest/useScGetSeasonMostPopular";
import { formatSpread } from "../../../util/format";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScMostPopularThisSeasonPage.module.css";

export const ScMostPopularThisSeasonPage = () => {
  const { data: seasonMostPopularData } = useScGetSeasonMostPopular();
  if (!seasonMostPopularData) {
    return <LoadingSpinner />;
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
        <td className={classes.hideForMobile}>{weekNumber}</td>
        <td>
          <div className={classes.flexRow}>
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
        <td className={classes.hideForMobile}>{gameScore}</td>
        <td className={resultClassName}>{result}</td>
      </tr>
    );
  });

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Supercontest | Season's Most Popular</title>
      </Helmet>
      <div className={classes.title}>Most Popular Picks of the Season</div>
      {mostPopularPickRows?.length === 0 && (
        <div className={classes.noPicks}>No picks yet.</div>
      )}
      {mostPopularPickRows && mostPopularPickRows.length > 0 && (
        <Table striped highlightOnHover className={classes.table}>
          <thead>
            <tr>
              <th className={classes.hideForMobile}>Week</th>
              <th>Pick</th>
              <th>Opponent</th>
              <th>Count</th>
              <th className={classes.hideForMobile}>Score</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>{mostPopularPickRows}</tbody>
        </Table>
      )}
    </div>
  );
};
