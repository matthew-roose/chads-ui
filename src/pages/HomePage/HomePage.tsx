import { Divider, Table } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { useGetCurrentGameLines } from "../../hooks/useGetCurrentGameLines";
import { useGetCurrentWeekNumber } from "../../hooks/useGetCurrentWeekNumber";
import { AllTeamLogos } from "../../assets/AllTeamLogos";
import classes from "./HomePage.module.css";
import {
  convertOddsFromDecimal,
  formatCurrency,
  formatRecord,
  formatSpread,
  formatTeamMascot,
  formatTimestamp,
} from "../../util/format";
import { useSbGetPrevWeekBestParlay } from "../../hooks/sportsbook/useSbGetPrevWeekBestParlay";
import { useScGetPrevWeekBestPicks } from "../../hooks/supercontest/useScGetPrevWeekBestPicks";
import { Result } from "../../types/Result";
import { SbBetLegType } from "../../types/sportsbook/SbBetLegType";
import { useSvGetPrevWeekLosses } from "../../hooks/survivor/useSvGetPrevWeekLosses";

export const HomePage = () => {
  const { data: gameLinesData } = useGetCurrentGameLines();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: prevWeekBestParlayData } =
    useSbGetPrevWeekBestParlay(currentWeekNumber);
  const { data: prevWeekBestPicksData } =
    useScGetPrevWeekBestPicks(currentWeekNumber);
  const { data: prevWeekSurvivorLosersData } =
    useSvGetPrevWeekLosses(currentWeekNumber);

  if (!currentWeekNumber || !gameLinesData) {
    return null;
  }

  const gameRows = gameLinesData.map((gameLine) => {
    const { timestamp, homeTeam, awayTeam, homeSpread, homeScore, awayScore } =
      gameLine;
    let displayScore;
    if (homeScore !== null && awayScore !== null) {
      displayScore =
        homeScore > awayScore
          ? `${homeScore}-${awayScore} ${formatTeamMascot(homeTeam)}`
          : homeScore < awayScore
          ? `${awayScore}-${homeScore} ${formatTeamMascot(awayTeam)}`
          : `${homeScore}-${awayScore} Tie`;
    }
    return (
      <tr className={classes.row} key={homeTeam}>
        <td className={classes.hideForMobile}>
          {formatTimestamp(timestamp, true)}
        </td>
        <td className={classes.matchup}>
          <img
            className={classes.matchupLogo}
            src={AllTeamLogos[awayTeam] as unknown as string}
            alt={awayTeam}
          />
          <div className={classes.at}>@</div>
          <img
            className={classes.matchupLogo}
            src={AllTeamLogos[homeTeam] as unknown as string}
            alt={homeTeam}
          />
        </td>
        <td>
          {homeTeam.split("_").pop()} {formatSpread(homeSpread)}
        </td>
        <td>{displayScore}</td>
      </tr>
    );
  });

  const prevWeekBestParlay = prevWeekBestParlayData
    ? prevWeekBestParlayData
    : [];
  const bestParlayRows = prevWeekBestParlay.map((parlay) => {
    const { username, effectiveOdds, wager, effectiveToWinAmount, betLegs } =
      parlay;
    return (
      <tr className={classes.row} key={username}>
        <td>{username}</td>
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
              result === Result.WIN ? classes.win : classes.push;
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
            }
            return (
              <div key={id} className={classes.matchup}>
                {logoToShow === "home" && (
                  <img
                    className={classes.matchupLogo}
                    src={AllTeamLogos[homeTeam] as unknown as string}
                    alt={homeTeam}
                  />
                )}
                {logoToShow === "away" && (
                  <img
                    className={classes.matchupLogo}
                    src={AllTeamLogos[awayTeam] as unknown as string}
                    alt={awayTeam}
                  />
                )}
                {logoToShow === "both" && (
                  <>
                    <img
                      className={classes.matchupLogo}
                      src={AllTeamLogos[awayTeam] as unknown as string}
                      alt={awayTeam}
                    />
                    <img
                      className={classes.matchupLogo}
                      src={AllTeamLogos[homeTeam] as unknown as string}
                      alt={homeTeam}
                    />
                  </>
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
        <td>{convertOddsFromDecimal(effectiveOdds)}</td>
        <td className={classes.hideForMobile}>{formatCurrency(wager, 0)}</td>
        <td className={classes.hideForMobile}>
          {formatCurrency(effectiveToWinAmount, 0)}
        </td>
      </tr>
    );
  });

  const prevWeekBestPicks = prevWeekBestPicksData ? prevWeekBestPicksData : [];
  const bestPicksRows = prevWeekBestPicks.map((entryWeek) => {
    const { username, weekScore, weekWins, weekLosses, weekPushes, picks } =
      entryWeek;
    return (
      <tr className={classes.row} key={username}>
        <td>{username}</td>
        <td>
          {picks.map((pick) => {
            const { pickedTeam, homeTeam, homeSpread, result } = pick;
            const pickResultClass =
              result === Result.WIN
                ? classes.win
                : result === Result.LOSS
                ? classes.loss
                : classes.push;
            const spread =
              pickedTeam === homeTeam ? homeSpread : homeSpread * -1;
            const pickText = `${pickedTeam.split("_").pop()} ${formatSpread(
              spread
            )}`;
            return (
              <div key={pickedTeam} className={classes.matchup}>
                <img
                  className={classes.matchupLogo}
                  src={AllTeamLogos[pickedTeam] as unknown as string}
                  alt={pickedTeam}
                />
                <div className={classes.viewPickText}>
                  {pickText}
                  <span>{result ? `: ` : ""}</span>
                  <span className={pickResultClass}>
                    {result ? `${result}` : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </td>
        <td>{formatRecord(weekWins, weekLosses, weekPushes)}</td>
        <td className={classes.hideForMobile}>{weekScore.toFixed(1)}</td>
      </tr>
    );
  });

  const prevWeekSurvivorLosers = prevWeekSurvivorLosersData
    ? prevWeekSurvivorLosersData
    : [];
  const losersRows = prevWeekSurvivorLosers.map((loser) => {
    const {
      username,
      pickedTeam,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      result,
    } = loser;
    const opposingTeam = pickedTeam === homeTeam ? awayTeam : homeTeam;
    const score =
      pickedTeam === homeTeam
        ? `${homeScore}-${awayScore}`
        : `${awayScore}-${homeScore}`;
    return (
      <tr className={classes.row} key={username}>
        <td>{username}</td>
        <td>
          <img
            className={classes.matchupLogo}
            src={AllTeamLogos[pickedTeam] as unknown as string}
            alt={pickedTeam}
          />
        </td>
        <td>
          <img
            className={classes.matchupLogo}
            src={AllTeamLogos[opposingTeam] as unknown as string}
            alt={opposingTeam}
          />
        </td>
        <td>{score}</td>
        <td className={classes.loss}>{result}</td>
      </tr>
    );
  });

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Home</title>
      </Helmet>
      <div className={classes.title}>This Week's Games</div>
      <Table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.hideForMobile}>Date</th>
            <th>Matchup</th>
            <th>Spread</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>{gameRows}</tbody>
      </Table>
      <Divider className={classes.divider} />
      <div className={classes.title}>Last Week's Best Parlay</div>
      {currentWeekNumber === 1 && (
        <div className={classes.week1Message}>
          Come back next week to see Week 1's best parlay!
        </div>
      )}
      {bestParlayRows.length > 0 && (
        <Table className={classes.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Bet</th>
              <th>Odds</th>
              <th className={classes.hideForMobile}>Wager</th>
              <th className={classes.hideForMobile}>To Win</th>
            </tr>
          </thead>
          <tbody>{bestParlayRows}</tbody>
        </Table>
      )}
      {bestParlayRows.length === 0 && currentWeekNumber !== 1 && (
        <div className={classes.week1Message}>
          No one hit a parlay last week!
        </div>
      )}
      <Divider className={classes.divider} />
      <div className={classes.title}>Last Week's Best Picks</div>
      {currentWeekNumber === 1 && (
        <div className={classes.week1Message}>
          Come back next week to see Week 1's best picks!
        </div>
      )}
      {currentWeekNumber !== 1 && (
        <Table className={classes.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Picks</th>
              <th>Record</th>
              <th className={classes.hideForMobile}>Score</th>
            </tr>
          </thead>
          <tbody>{bestPicksRows}</tbody>
        </Table>
      )}
      <Divider className={classes.divider} />
      <div className={classes.title}>Last Week's Survivor Losers</div>
      {currentWeekNumber === 1 && (
        <div className={classes.week1Message}>
          Come back next week to see Week 1's losers!
        </div>
      )}
      {losersRows.length > 0 && (
        <Table className={classes.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Pick</th>
              <th>Opponent</th>
              <th className={classes.hideForMobile}>Score</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>{losersRows}</tbody>
        </Table>
      )}
      {losersRows.length === 0 && currentWeekNumber !== 1 && (
        <div className={classes.week1Message}>No one lost last week!</div>
      )}
    </div>
  );
};
