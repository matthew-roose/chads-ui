import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSbGetPublicMoneyStats } from "../../../hooks/sportsbook/useSbGetPublicMoneyStats";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useGetGameLinesForWeek } from "../../../hooks/useGetGameLinesForWeek";
import classes from "./SbWeeklyPublicMoneyPage.module.css";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { WeekSelect } from "../../../components/WeekSelect/WeekSelect";
import { Table } from "@mantine/core";
import {
  convertOddsFromDecimal,
  formatCurrency,
  formatSpread,
  formatTimestamp,
} from "../../../util/format";

export const SbWeeklyPublicMoneyPage = () => {
  const { weekNumber } = useParams();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: publicMoneyData } = useSbGetPublicMoneyStats(
    weekNumber ? +weekNumber : undefined
  );
  const { data: gameLinesData } = useGetGameLinesForWeek(
    weekNumber ? +weekNumber : undefined
  );

  if (!currentWeekNumber || !publicMoneyData || !gameLinesData) {
    return null;
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  if (!weekNumber || !allWeekNumbers.includes(weekNumber)) {
    return <div>Invalid week number in URL.</div>;
  }

  const publicMoneyRows = publicMoneyData
    .sort((a, b) => a.gameId - b.gameId)
    .map((game) => {
      const {
        gameId,
        homeSpreadMoney,
        homeMoneylineMoney,
        awaySpreadMoney,
        awayMoneylineMoney,
        overMoney,
        underMoney,
      } = game;

      const spreadSum = homeSpreadMoney + awaySpreadMoney;
      const moneylineSum = homeMoneylineMoney + awayMoneylineMoney;
      const totalSum = overMoney + underMoney;

      const homeSpreadPct = (homeSpreadMoney / spreadSum) * 100;
      const awaySpreadPct = (awaySpreadMoney / spreadSum) * 100;
      const homeMoneylinePct = (homeMoneylineMoney / moneylineSum) * 100;
      const awayMoneylinePct = (awayMoneylineMoney / moneylineSum) * 100;
      const overMoneyPct = (overMoney / totalSum) * 100;
      const underMoneyPct = (underMoney / totalSum) * 100;

      const gameLine = gameLinesData.find(
        (gameLine) => gameLine.gameId === gameId
      );

      if (!gameLine) {
        return null;
      }

      const {
        timestamp,
        homeTeam,
        awayTeam,
        homeSpread,
        homeMoneyline,
        awayMoneyline,
        gameTotal,
      } = gameLine;

      return (
        <tr key={gameId} className={classes.keepHeight}>
          <td className={classes.hideForMobile}>
            {formatTimestamp(timestamp, true)}
          </td>
          <td>
            <div className={classes.game}>
              <img
                className={classes.logo}
                src={AllTeamLogos[awayTeam] as unknown as string}
                alt={awayTeam}
              />
              <div className={classes.xMargin}>at</div>
              <img
                className={classes.logo}
                src={AllTeamLogos[homeTeam] as unknown as string}
                alt={homeTeam}
              />
            </div>
          </td>
          {/* Spreads */}
          {homeSpreadMoney === 0 && awaySpreadMoney === 0 && <td>N/A</td>}
          {homeSpreadMoney !== 0 && homeSpreadMoney >= awaySpreadMoney && (
            <td>{`${homeSpreadPct.toFixed(0)}% (${formatCurrency(
              homeSpreadMoney,
              0
            )}) ${homeTeam.split("_").pop()} ${formatSpread(homeSpread)}`}</td>
          )}
          {homeSpreadMoney < awaySpreadMoney && (
            <td>{`${awaySpreadPct.toFixed(0)}% (${formatCurrency(
              awaySpreadMoney,
              0
            )}) ${awayTeam.split("_").pop()} ${formatSpread(
              homeSpread * -1
            )}`}</td>
          )}
          {/* Moneylines */}
          {homeMoneylineMoney === 0 && awayMoneylineMoney === 0 && <td>N/A</td>}
          {homeMoneylineMoney !== 0 &&
            homeMoneylineMoney >= awayMoneylineMoney && (
              <td>{`${homeMoneylinePct.toFixed(0)}% (${formatCurrency(
                homeMoneylineMoney,
                0
              )}) ${homeTeam.split("_").pop()} ${convertOddsFromDecimal(
                homeMoneyline
              )}`}</td>
            )}
          {homeMoneylineMoney < awayMoneylineMoney && (
            <td>{`${awayMoneylinePct.toFixed(0)}% (${formatCurrency(
              awayMoneylineMoney,
              0
            )}) ${awayTeam.split("_").pop()} ${convertOddsFromDecimal(
              awayMoneyline
            )}`}</td>
          )}
          {/* Totals */}
          {overMoney === 0 && underMoney === 0 && <td>N/A</td>}
          {overMoney !== 0 && overMoney >= underMoney && (
            <td>{`${overMoneyPct.toFixed(0)}% (${formatCurrency(
              overMoney,
              0
            )}) Over ${gameTotal.toFixed(1)}`}</td>
          )}
          {overMoney < underMoney && (
            <td>{`${underMoneyPct.toFixed(0)}% (${formatCurrency(
              underMoney,
              0
            )}) Under ${gameTotal.toFixed(1)}`}</td>
          )}
        </tr>
      );
    });

  const getNavigateUrl = (weekNumber: string | null) => {
    if (!weekNumber) {
      return "/";
    }
    return `/sportsbook/public-money/week/${weekNumber}`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SB Week {weekNumber} Public Money</title>
      </Helmet>
      <WeekSelect
        weekNumber={weekNumber}
        allWeekNumbers={allWeekNumbers}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>Week {weekNumber} Public Money</div>
      <Table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.hideForMobile}>Date</th>
            <th>Game</th>
            <th>Spread</th>
            <th>Moneyline</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>{publicMoneyRows}</tbody>
      </Table>
    </div>
  );
};
