import { Table } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { WeekSelect } from "../../../components/WeekSelect/WeekSelect";
import { useSvGetWeekMostPopular } from "../../../hooks/survivor/useSvGetWeekMostPopular";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvMostPopularThisWeekPage.module.css";

export const SvMostPopularThisWeekPage = () => {
  const { weekNumber } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: weekMostPopularData } = useSvGetWeekMostPopular(
    weekNumber ? +weekNumber : currentWeekNumber
  );

  if (!currentWeekNumber) {
    return <LoadingSpinner type="primary" />;
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  if (!weekNumber || !allWeekNumbers.includes(weekNumber)) {
    return <div>Invalid week number in URL.</div>;
  }

  const mostPopularPickRows = weekMostPopularData?.map((pick) => {
    const {
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
        <td>{gameScore}</td>
        <td className={resultClassName}>{result}</td>
      </tr>
    );
  });

  const getNavigateUrl = (weekNumber: string | null) => {
    if (!weekNumber) {
      return "/";
    }
    return `/survivor/public-picks/week/${weekNumber}`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SV Week {weekNumber} Most Popular</title>
      </Helmet>
      <WeekSelect
        weekNumber={weekNumber}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        Most Popular Picks of Week {weekNumber}
      </div>
      {!weekMostPopularData && <LoadingSpinner type="secondary" />}
      {mostPopularPickRows !== undefined && (
        <Table striped highlightOnHover className={classes.table}>
          <thead>
            <tr>
              <th>Team</th>
              <th className={classes.hideForMobile}>Opponent</th>
              <th>Count</th>
              <th>Score</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>{mostPopularPickRows}</tbody>
        </Table>
      )}
    </div>
  );
};
