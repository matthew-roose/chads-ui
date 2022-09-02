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
  formatSpread,
  formatTimestamp,
  formatUsernamePossessiveForm,
} from "../../../util/format";
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

  if (!allUsernames || !currentWeekNumber || !userBetData) {
    return null;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div>Invalid username in URL.</div>;
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  if (!weekNumber || !allWeekNumbers.includes(weekNumber)) {
    return <div>Invalid week number in URL.</div>;
  }

  const betRows = userBetData.map((bet) => {
    const {
      placedTimestamp,
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
          {formatTimestamp(placedTimestamp, false)}
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
            let logoToShow;
            let textToShow;
            if (betLegType === SbBetLegType.HOME_SPREAD) {
              logoToShow = "home";
              textToShow = `${homeTeam.split("_").pop()} ${formatSpread(
                homeSpread
              )} ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.AWAY_SPREAD) {
              logoToShow = "away";
              textToShow = `${awayTeam.split("_").pop()} ${formatSpread(
                homeSpread * -1
              )} ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.HOME_MONEYLINE) {
              logoToShow = "home";
              textToShow = `${homeTeam
                .split("_")
                .pop()} ML ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.AWAY_MONEYLINE) {
              logoToShow = "away";
              textToShow = `${awayTeam
                .split("_")
                .pop()} ML ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.OVER_TOTAL) {
              logoToShow = "both";
              textToShow = `Over ${gameTotal.toFixed(
                1
              )} ${convertOddsFromDecimal(odds)}`;
            } else if (betLegType === SbBetLegType.UNDER_TOTAL) {
              logoToShow = "both";
              textToShow = `Under ${gameTotal.toFixed(
                1
              )} ${convertOddsFromDecimal(odds)}`;
            } else {
              logoToShow = "mystery";
              textToShow = "Hidden";
            }
            return (
              <div key={id} className={classes.viewBetLogoAndText}>
                {logoToShow === "home" && (
                  <img
                    className={classes.viewBetLogo}
                    src={AllTeamLogos[homeTeam] as unknown as string}
                    alt={homeTeam}
                  />
                )}
                {logoToShow === "away" && (
                  <img
                    className={classes.viewBetLogo}
                    src={AllTeamLogos[awayTeam] as unknown as string}
                    alt={awayTeam}
                  />
                )}
                {logoToShow === "both" && (
                  <>
                    <img
                      className={classes.viewBetLogo}
                      src={AllTeamLogos[awayTeam] as unknown as string}
                      alt={awayTeam}
                    />
                    <img
                      className={classes.viewBetLogo}
                      src={AllTeamLogos[homeTeam] as unknown as string}
                      alt={homeTeam}
                    />
                  </>
                )}
                {logoToShow === "mystery" && (
                  <img
                    className={`${classes.viewBetLogo} ${classes.hiddenBet}`}
                    src={require("../../../assets/mystery_team.png")}
                    alt="Mystery Team"
                  />
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
        <td>{formatCurrency(wager, 2)}</td>
        <td className={classes.hideSecondForMobile}>
          {odds === effectiveOdds || result === Result.PUSH ? (
            convertOddsFromDecimal(odds)
          ) : (
            <>
              <span style={{ textDecoration: "line-through" }}>
                {convertOddsFromDecimal(odds)}
              </span>{" "}
              <span>{convertOddsFromDecimal(effectiveOdds)}</span>
            </>
          )}
        </td>
        <td>
          {toWinAmount === effectiveToWinAmount || result === Result.PUSH ? (
            formatCurrency(toWinAmount, 2)
          ) : (
            <>
              <span
                className={classes.hideThirdForMobile}
                style={{ textDecoration: "line-through" }}
              >
                {formatCurrency(toWinAmount, 2)}
              </span>{" "}
              <span>{formatCurrency(effectiveToWinAmount, 2)}</span>
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

  const pageTitle = `${formatUsernamePossessiveForm(
    username
  )} Week ${weekNumber}
  Bets`;

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | {pageTitle}</title>
      </Helmet>
      <UserAndWeekSelects
        username={username}
        allUsernames={allUsernames}
        weekNumber={weekNumber}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>{pageTitle}</div>
      {userBetData.length === 0 && (
        <div className={classes.noBets}>No bets.</div>
      )}
      {userBetData.length > 0 && (
        <Table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.hideFirstForMobile}>Placed</th>
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
