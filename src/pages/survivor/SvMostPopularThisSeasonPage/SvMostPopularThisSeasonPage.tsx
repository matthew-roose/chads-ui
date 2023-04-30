import { Table } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { useSvGetSeasonMostPopular } from "../../../hooks/survivor/useSvGetSeasonMostPopular";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvMostPopularThisSeasonPage.module.css";

export const SvMostPopularThisSeasonPage = () => {
  const { data: seasonMostPopularData } = useSvGetSeasonMostPopular();
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
        <td className={classes.hideForMobile}>{gameScore}</td>
        <td className={resultClassName}>{result}</td>
      </tr>
    );
  });

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Survivor | Season's Most Popular</title>
      </Helmet>
      <div className={classes.title}>Most Popular Picks of the Season</div>
      {mostPopularPickRows.length === 0 && (
        <div className={classes.noPicks}>No picks yet.</div>
      )}
      {mostPopularPickRows.length > 0 && (
        <Table striped highlightOnHover className={classes.table}>
          <thead>
            <tr>
              <th>Week</th>
              <th>Team</th>
              <th className={classes.hideForMobile}>Opponent</th>
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
