import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Table } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { ChadContext } from "../../../store/chad-context";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useScGetWeekMostPopular } from "../../../hooks/supercontest/useScGetWeekMostPopular";
import { formatSpread } from "../../../util/format";
import { WeekSelect } from "../../../components/WeekSelect/WeekSelect";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScMostPopularThisWeekPage.module.css";

export const ScMostPopularThisWeekPage = () => {
  const { useDarkMode } = useContext(ChadContext);
  const { weekNumber } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: weekMostPopularData } = useScGetWeekMostPopular(
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
      <tr className={classes.row} key={pickedTeam}>
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

  const getNavigateUrl = (weekNumber: string | null) => {
    if (!weekNumber) {
      return "/";
    }
    return `/supercontest/public-picks/week/${weekNumber}`;
  };

  const isInvalidWeekNumber =
    !weekNumber || (currentWeekNumber && !allWeekNumbers.includes(weekNumber));

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Supercontest | Week {weekNumber}'s Most Popular</title>
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
