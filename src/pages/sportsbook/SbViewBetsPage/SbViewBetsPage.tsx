import { Table } from "@mantine/core";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { UserAndWeekSelects } from "../../../components/UserAndWeekSelects/UserAndWeekSelects";
import { useSbGetUserBetsForWeek } from "../../../hooks/sportsbook/useSbGetUserBetsForWeek";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { AuthContext } from "../../../store/auth-context";
import { Result } from "../../../types/Result";
import { SbBetLegType } from "../../../types/sportsbook/SbBetLegType";
import {
  convertOddsFromDecimal,
  formatCurrency,
  formatEnum,
  formatSpread,
  formatTimestamp,
  formatUsernamePossessiveForm,
} from "../../../util/format";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbViewBetsPage.module.css";

export const SbViewBetsPage = () => {
  const { googleJwt } = useContext(AuthContext);
  const { username, weekNumber } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: userBetData } = useSbGetUserBetsForWeek(
    googleJwt,
    username,
    weekNumber ? +weekNumber : undefined
  );

  const allWeekNumbers = Array.from(
    { length: currentWeekNumber || 0 },
    (_, i) => (i + 1).toString()
  );

  const betRows = userBetData?.map((bet) => {
    const {
      placedTimestamp,
      betType,
      odds,
      effectiveOdds,
      wager,
      toWinAmount,
      effectiveToWinAmount,
      result,
      betLegs,
    } = bet;
    const betResultClass =
      result === Result.WIN
        ? classes.win
        : result === Result.LOSS
        ? classes.loss
        : result === Result.PUSH
        ? classes.push
        : "";
    return (
      <tr key={placedTimestamp}>
        <td className={classes.hideFirstForMobile}>
          {formatTimestamp(placedTimestamp, true)}
        </td>
        <td className={classes.hideFirstForMobile}>
          {formatEnum(betType.toString())}
        </td>
        <td>
          {betLegs.map((betLeg) => {
            const {
              id,
              betLegType,
              odds,
              homeSpread,
              gameTotal,
              homeTeam,
              awayTeam,
              result,
            } = betLeg;
            const betLegResultClass =
              result === Result.WIN
                ? classes.win
                : result === Result.LOSS
                ? classes.loss
                : result === Result.PUSH
                ? classes.push
                : "";
            let textToShow;
            if (
              betLegType === null ||
              homeTeam === null ||
              awayTeam === null ||
              homeSpread === null ||
              gameTotal === null ||
              odds === null
            ) {
              textToShow = "Hidden";
            } else if (betLegType === SbBetLegType.HOME_SPREAD) {
              textToShow = `${homeTeam.split("_").pop()} ${formatSpread(
                homeSpread
              )} ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.AWAY_SPREAD) {
              textToShow = `${awayTeam.split("_").pop()} ${formatSpread(
                homeSpread * -1
              )} ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.HOME_MONEYLINE) {
              textToShow = `${homeTeam
                .split("_")
                .pop()} ML ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.AWAY_MONEYLINE) {
              textToShow = `${awayTeam
                .split("_")
                .pop()} ML ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.OVER_TOTAL) {
              textToShow = `Over ${gameTotal.toFixed(
                1
              )} ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.UNDER_TOTAL) {
              textToShow = `Under ${gameTotal.toFixed(
                1
              )} ${convertOddsFromDecimal(odds)}`;
            }

            return (
              <div key={id} className={classes.viewBetLogoAndText}>
                {homeTeam !== null && awayTeam !== null ? (
                  <div className={classes.logos}>
                    <img
                      className={classes.viewBetLogo}
                      src={AllTeamLogos[awayTeam] as unknown as string}
                      alt={awayTeam}
                    />
                    <span className={classes.atSymbol}>@</span>
                    <img
                      className={classes.viewBetLogo}
                      src={AllTeamLogos[homeTeam] as unknown as string}
                      alt={homeTeam}
                    />
                  </div>
                ) : (
                  <div className={classes.logos}>
                    <img
                      className={`${classes.viewBetLogo} ${classes.hiddenBet}`}
                      src={require("../../../assets/mystery_team.png")}
                      alt="Mystery Team"
                      style={{ borderRadius: "4px" }}
                    />
                    <span className={classes.atSymbol}>@</span>
                    <img
                      className={`${classes.viewBetLogo} ${classes.hiddenBet}`}
                      src={require("../../../assets/mystery_team.png")}
                      alt="Mystery Team"
                      style={{ borderRadius: "4px" }}
                    />
                  </div>
                )}
                <div className={classes.viewBetText}>
                  {textToShow}
                  <span>{result ? `: ` : ""}</span>
                  <span className={betLegResultClass}>
                    {result ? `${result}` : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </td>
        <td>{formatCurrency(wager, 0)}</td>
        <td className={classes.hideSecondForMobile}>
          {odds === effectiveOdds || result === Result.PUSH ? (
            convertOddsFromDecimal(odds)
          ) : (
            <>
              <span className={classes.lineThrough}>
                {convertOddsFromDecimal(odds)}
              </span>{" "}
              <span>{convertOddsFromDecimal(effectiveOdds)}</span>
            </>
          )}
        </td>
        <td>
          {toWinAmount === effectiveToWinAmount || result === Result.PUSH ? (
            formatCurrency(toWinAmount, 0)
          ) : (
            <>
              <span
                className={`${classes.lineThrough} ${classes.hideThirdForMobile}`}
              >
                {formatCurrency(toWinAmount, 0)}
              </span>{" "}
              <span>{formatCurrency(effectiveToWinAmount, 0)}</span>
            </>
          )}
        </td>
        <td className={betResultClass}>{result}</td>
      </tr>
    );
  });

  const getNavigateUrl = (
    username: string | null,
    weekNumber: string | null
  ) => {
    if (!username || !weekNumber) {
      return "/";
    }
    return `/sportsbook/bet-history/${username}/week/${weekNumber}`;
  };

  const isInvalidUsername =
    !username || (allUsernames && !allUsernames.includes(username));
  const isInvalidWeekNumber =
    !weekNumber || (currentWeekNumber && !allWeekNumbers.includes(weekNumber));

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | Sportsbook | {formatUsernamePossessiveForm(username || "")}{" "}
          Week {weekNumber} Bets
        </title>
      </Helmet>
      <UserAndWeekSelects
        username={username || ""}
        allUsernames={allUsernames || []}
        weekNumber={weekNumber || ""}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      {!isInvalidUsername && !isInvalidWeekNumber && (
        <div className={classes.title}>
          {formatUsernamePossessiveForm(username || "")} Week {weekNumber} Bets
        </div>
      )}
      {isInvalidUsername && (
        <div className={classes.message}>Invalid username in URL.</div>
      )}
      {!isInvalidUsername && isInvalidWeekNumber && (
        <div className={classes.message}>Invalid week number in URL.</div>
      )}
      {!userBetData && <LoadingSpinner />}
      {!isInvalidUsername &&
        !isInvalidWeekNumber &&
        userBetData?.length === 0 && (
          <div className={classes.message}>No bets.</div>
        )}
      {userBetData && userBetData.length > 0 && (
        <Table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.hideFirstForMobile}>Placed</th>
              <th className={classes.hideFirstForMobile}>Type</th>
              <th>Bet</th>
              <th>Wager</th>
              <th className={classes.hideSecondForMobile}>Odds</th>
              <th>To Win</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>{betRows}</tbody>
        </Table>
      )}
    </div>
  );
};
