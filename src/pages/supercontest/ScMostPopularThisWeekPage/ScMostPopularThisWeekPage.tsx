import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Table } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useScGetWeekMostPopular } from "../../../hooks/supercontest/useScGetWeekMostPopular";
import { formatSpread } from "../../../util/format";
import classes from "./ScMostPopularThisWeekPage.module.css";
import { WeekSelect } from "../../../components/WeekSelect/WeekSelect";
import { Result } from "../../../types/Result";

export const ScMostPopularThisWeekPage = () => {
  const { weekNumber } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: weekMostPopularData } = useScGetWeekMostPopular(
    weekNumber ? +weekNumber : currentWeekNumber
  );

  if (!currentWeekNumber || !weekMostPopularData) {
    return null;
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  if (!weekNumber || !allWeekNumbers.includes(weekNumber)) {
    return <div>Invalid week number in URL.</div>;
  }

  const mostPopularPickRows = weekMostPopularData.map((pick) => {
    const {
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
      <tr className={classes.row} key={pickedTeam}>
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
        <td>{gameScore}</td>
        <td className={resultClassName}>{result}</td>
      </tr>
    );
  });

  const getNavigateUrl = (weekNumber: string | null) => {
    if (!weekNumber) {
      return "/";
    }
    return `/supercontest/public-picks/week/${weekNumber}`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SC Week {weekNumber} Most Popular</title>
      </Helmet>
      <WeekSelect
        weekNumber={weekNumber}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        Most Popular Picks of Week {weekNumber}
      </div>
      <Table striped highlightOnHover className={classes.table}>
        <thead>
          <tr>
            <th>Team</th>
            <th className={classes.hideForMobile}>Opponent</th>
            <th>Count</th>
            <th>Spread</th>
            <th>Score</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>{mostPopularPickRows}</tbody>
      </Table>
    </div>
  );
};
