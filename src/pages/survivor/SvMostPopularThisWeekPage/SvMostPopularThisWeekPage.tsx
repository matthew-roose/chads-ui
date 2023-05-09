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
import { useContext } from "react";
import { ChadContext } from "../../../store/chad-context";

export const SvMostPopularThisWeekPage = () => {
  const { useDarkMode } = useContext(ChadContext);
  const { weekNumber } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: weekMostPopularData } = useSvGetWeekMostPopular(
    weekNumber ? +weekNumber : currentWeekNumber
  );

  const allWeekNumbers = Array.from(
    { length: currentWeekNumber || 0 },
    (_, i) => (i + 1).toString()
  );

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
      <tr className={classes.row} key={pickedTeam}>
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

  const getNavigateUrl = (weekNumber: string | null) => {
    if (!weekNumber) {
      return "/";
    }
    return `/survivor/public-picks/week/${weekNumber}`;
  };

  const isInvalidWeekNumber =
    !weekNumber || (currentWeekNumber && !allWeekNumbers.includes(weekNumber));

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Survivor | Week {weekNumber}'s Most Popular</title>
      </Helmet>
      <WeekSelect
        weekNumber={weekNumber || ""}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      {!isInvalidWeekNumber && (
        <div className={classes.title}>
          Most Popular Picks of Week {weekNumber}
        </div>
      )}
      {isInvalidWeekNumber && (
        <div className={classes.message}>Invalid week number in URL.</div>
      )}
      {!weekMostPopularData && <LoadingSpinner />}
      {!isInvalidWeekNumber && mostPopularPickRows?.length === 0 && (
        <div className={classes.message}>No picks yet.</div>
      )}
      {mostPopularPickRows && mostPopularPickRows.length > 0 && (
        <Table striped highlightOnHover className={classes.table}>
          <thead>
            <tr>
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
