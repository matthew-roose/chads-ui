import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../../store/auth-context";
import {
  Aside,
  Button,
  NativeSelect,
  NumberInput,
  ScrollArea,
  SegmentedControl,
  Table,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { useGetCurrentGameLines } from "../../../hooks/useGetCurrentGameLines";
import { SbPlaceBetGame } from "../../../components/SbPlaceBetGame/SbPlaceBetGame";
import { useSbPlaceBet } from "../../../hooks/sportsbook/useSbPlaceBet";
import { SbBetLegCreate } from "../../../types/sportsbook/SbBetLegCreate";
import { useSbGetUserPools } from "../../../hooks/sportsbook/useSbGetUserPools";
import { SbBetLegType } from "../../../types/sportsbook/SbBetLegType";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import {
  convertOddsFromDecimal,
  formatCurrency,
  formatSpread,
} from "../../../util/format";
import { TEASER_LEG_ODDS } from "../../../util/constants";
import classes from "./SbPlaceBetsPage.module.css";

type TeaserPointOption = 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10;

export const SbPlaceBetsPage = () => {
  const { googleJwt, username } = useContext(AuthContext);
  // only used for screens <993px
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [parlayOrTeaser, setParlayOrTeaser] = useState<"Parlay" | "Teaser">(
    "Parlay"
  );
  const [teaserPoints, setTeaserPoints] = useState<TeaserPointOption>(6);
  const [wager, setWager] = useState(0);
  const [betLegs, setBetLegs] = useState<SbBetLegCreate[]>([]);

  const { data: currentWeekGameLines } = useGetCurrentGameLines();
  const { data: currentAccountBalance, refetch: refetchAccountBalance } =
    useSbGetUserPools(username);

  const placeBet = useSbPlaceBet();

  if (!googleJwt || !username) {
    return <div className={classes.message}>Please sign in to place bets.</div>;
  }

  if (!currentWeekGameLines || !currentAccountBalance) {
    return <LoadingSpinner type="primary" />;
  }

  const { availableBalance } = currentAccountBalance;

  const hideBetSlip = showBetSlip ? "" : classes.hideBetSlip;

  const isBetLegOnATeam = (betLegType: SbBetLegType) =>
    betLegType === SbBetLegType.HOME_SPREAD ||
    betLegType === SbBetLegType.AWAY_SPREAD ||
    betLegType === SbBetLegType.HOME_MONEYLINE ||
    betLegType === SbBetLegType.AWAY_MONEYLINE;

  const isBetLegOnATotal = (betLegType: SbBetLegType) =>
    betLegType === SbBetLegType.OVER_TOTAL ||
    betLegType === SbBetLegType.UNDER_TOTAL;

  const areBothBetLegsOnATeam = (
    oldBetLegType: SbBetLegType,
    newBetLegType: SbBetLegType
  ) => isBetLegOnATeam(oldBetLegType) && isBetLegOnATeam(newBetLegType);

  const areBothBetLegsOnATotal = (
    oldBetLegType: SbBetLegType,
    newBetLegType: SbBetLegType
  ) => isBetLegOnATotal(oldBetLegType) && isBetLegOnATotal(newBetLegType);

  const addBetLeg = ({ gameId, betLegType: newBetLegType }: SbBetLegCreate) => {
    if (
      newBetLegType === SbBetLegType.HOME_MONEYLINE ||
      newBetLegType === SbBetLegType.AWAY_MONEYLINE
    ) {
      // can't tease a moneyline
      setParlayOrTeaser("Parlay");
    }
    const gameLine = currentWeekGameLines.find(
      (game) => game.gameId === gameId
    );
    if (!gameLine) {
      return;
    }
    if (gameLine.timestamp <= Date.now()) {
      return;
    }
    const existingBetLegs = betLegs.filter(
      (betLeg) => betLeg.gameId === gameId
    );
    // only remove existing bet leg if it's in the same category as the new one
    const betLegToRemove = existingBetLegs.find(
      (oldBetLeg) =>
        areBothBetLegsOnATeam(oldBetLeg.betLegType, newBetLegType) ||
        areBothBetLegsOnATotal(oldBetLeg.betLegType, newBetLegType)
    );
    if (betLegToRemove) {
      setBetLegs((prevBetLegs) =>
        prevBetLegs.filter(
          (betLeg) =>
            !(
              betLeg.gameId === betLegToRemove.gameId &&
              betLeg.betLegType === betLegToRemove.betLegType
            )
        )
      );
    }
    if (!betLegToRemove || !(betLegToRemove.betLegType === newBetLegType)) {
      setBetLegs((prevBetLegs) => [
        ...prevBetLegs,
        { gameId, betLegType: newBetLegType },
      ]);
    }
  };

  const gameElements = currentWeekGameLines
    .filter((line) => line.timestamp > Date.now())
    .map((line) => {
      let selectedBets;
      const existingBetLegs = betLegs.filter(
        (betLeg) => betLeg.gameId === line.gameId
      );
      if (existingBetLegs) {
        selectedBets = existingBetLegs.map((betLeg) => betLeg.betLegType);
      }
      return (
        <SbPlaceBetGame
          key={line.gameId}
          {...line}
          selectedBets={selectedBets}
          addBetLeg={addBetLeg}
        />
      );
    });

  const spreadAndTotalOdds =
    betLegs.length === 1 || parlayOrTeaser === "Parlay"
      ? 1.90909
      : TEASER_LEG_ODDS[teaserPoints as TeaserPointOption];
  const spreadAndTotalOddsString = convertOddsFromDecimal(spreadAndTotalOdds);
  let betOdds = 1;
  const getBetLegTypeSortValue = (betLegType: SbBetLegType) =>
    isBetLegOnATeam(betLegType) ? 1 : 2;

  const betSlipItems = betLegs
    .sort(
      (a, b) =>
        getBetLegTypeSortValue(a.betLegType) -
        getBetLegTypeSortValue(b.betLegType)
    )
    .sort((a, b) => a.gameId - b.gameId)
    .map((betLeg) => {
      const gameLine = currentWeekGameLines.find(
        (gameLine) => gameLine.gameId === betLeg.gameId
      );
      if (!gameLine) {
        return null;
      }
      const {
        gameId,
        homeTeam,
        awayTeam,
        homeSpread,
        homeMoneyline,
        awayMoneyline,
        gameTotal,
      } = gameLine;
      const { betLegType } = betLeg;
      let textToShow;
      const teaserPointsIfApplicable =
        parlayOrTeaser === "Teaser" ? teaserPoints : 0;
      if (betLegType === SbBetLegType.HOME_SPREAD) {
        betOdds *= spreadAndTotalOdds;
        textToShow = `${homeTeam.split("_").pop()} ${formatSpread(
          homeSpread + teaserPointsIfApplicable
        )} ${spreadAndTotalOddsString}`;
      } else if (betLegType === SbBetLegType.AWAY_SPREAD) {
        betOdds *= spreadAndTotalOdds;
        textToShow = `${awayTeam.split("_").pop()} ${formatSpread(
          homeSpread * -1 + teaserPointsIfApplicable
        )} ${spreadAndTotalOddsString}`;
      } else if (betLegType === SbBetLegType.HOME_MONEYLINE) {
        betOdds *= homeMoneyline;
        textToShow = `${homeTeam.split("_").pop()} ML ${convertOddsFromDecimal(
          homeMoneyline
        )}`;
      } else if (betLegType === SbBetLegType.AWAY_MONEYLINE) {
        betOdds *= awayMoneyline;
        textToShow = `${awayTeam.split("_").pop()} ML ${convertOddsFromDecimal(
          awayMoneyline
        )}`;
      } else if (betLegType === SbBetLegType.OVER_TOTAL) {
        betOdds *= spreadAndTotalOdds;
        textToShow = `Over ${(gameTotal - teaserPointsIfApplicable).toFixed(
          1
        )} ${spreadAndTotalOddsString}`;
      } else if (betLegType === SbBetLegType.UNDER_TOTAL) {
        betOdds *= spreadAndTotalOdds;
        textToShow = `Under ${(gameTotal + teaserPointsIfApplicable).toFixed(
          1
        )} ${spreadAndTotalOddsString}`;
      }

      return (
        <div key={`${gameId}${betLegType}`} className={classes.betSlipItem}>
          <div className={classes.betSlipItemLogoAndText}>
            <img
              className={classes.betSlipItemLogo}
              src={AllTeamLogos[awayTeam] as unknown as string}
              alt={awayTeam}
            />
            <span className={classes.atSymbol}>@</span>
            <img
              className={classes.betSlipItemLogo}
              src={AllTeamLogos[homeTeam] as unknown as string}
              alt={homeTeam}
            />
            <div className={classes.betSlipItemText}>{textToShow}</div>
          </div>

          <IconTrash
            className={classes.deleteLegIcon}
            size={24}
            color="red"
            onClick={() =>
              setBetLegs((prevState) =>
                prevState.filter(
                  (oldBetLeg) =>
                    !(
                      oldBetLeg.gameId === betLeg.gameId &&
                      oldBetLeg.betLegType === betLeg.betLegType
                    )
                )
              )
            }
          />
        </div>
      );
    });

  const toWinAmount = (betOdds - 1) * wager;

  const disableBetButton =
    wager > availableBalance ||
    wager === 0 ||
    betLegs.length === 0 ||
    toWinAmount > 1000000;

  const showBetSlipButton = (
    <Button
      variant="gradient"
      gradient={{ from: "teal", to: "lime" }}
      className={`${classes.button} ${classes.hideBetSlipButton}`}
      onClick={() => setShowBetSlip(true)}
    >
      Show Bet Slip
    </Button>
  );

  const closeBetSlipButton = (
    <Button
      variant="gradient"
      gradient={{ from: "teal", to: "lime" }}
      className={`${classes.button} ${classes.hideBetSlipButton}`}
      onClick={() => setShowBetSlip(false)}
    >
      Close Bet Slip
    </Button>
  );

  const clearBetSlipButton = (
    <Button
      variant="gradient"
      gradient={{ from: "orange", to: "red" }}
      className={`${classes.button}`}
      onClick={() => setBetLegs([])}
    >
      Clear All
    </Button>
  );

  const allInButton = (
    <Button
      className={classes.allInButton}
      variant="gradient"
      gradient={{ from: "indigo", to: "cyan" }}
      onClick={() => setWager(availableBalance)}
    >
      All in!
    </Button>
  );

  const placeBetButton = (
    <Button
      disabled={disableBetButton}
      variant="gradient"
      gradient={{ from: "teal", to: "lime" }}
      className={classes.button}
      onClick={() =>
        toast
          .promise(
            placeBet.mutateAsync({
              googleJwt,
              bet: {
                wager,
                betLegs,
                teaserPoints: parlayOrTeaser === "Teaser" ? teaserPoints : null,
              },
            }),
            {
              pending: "Placing your bet...",
              success: "Successfully placed your bet!",
              error: "Error placing your bet!",
            }
          )
          .then(() => refetchAccountBalance())
          .then(() => setWager(0))
          .then(() => setBetLegs([]))
          .then(() => setShowBetSlip(false))
      }
    >
      Place Bet
    </Button>
  );

  const wagerDisplayValue = wager !== 0 ? wager : undefined;

  const wagerErrorMessage =
    wager > 0 && wager < 1
      ? "The minimum bet is $1.00."
      : wager > 0 && availableBalance === 0
      ? "Your available balance is $0.00."
      : wager > availableBalance
      ? `You only have ${formatCurrency(availableBalance, 2)} to bet.`
      : toWinAmount > 1000000
      ? "The max win is $1M."
      : undefined;

  const betSlip = (
    <Aside className={hideBetSlip} p="sm" width={{ md: 360 }}>
      <Aside.Section grow component={ScrollArea} type="never">
        {closeBetSlipButton}
        <div className={classes.betSlip}>BET SLIP</div>
        {betLegs.length === 0 && (
          <div className={classes.noBets}>No bets selected.</div>
        )}
        {betLegs.length > 1 && (
          <>
            {!betLegs.find(
              (betLeg) =>
                betLeg.betLegType === SbBetLegType.HOME_MONEYLINE ||
                betLeg.betLegType === SbBetLegType.AWAY_MONEYLINE
            ) && (
              <div className={classes.betTypeSelect}>
                <SegmentedControl
                  size="lg"
                  radius="xl"
                  value={parlayOrTeaser}
                  onChange={(newValue) =>
                    setParlayOrTeaser(newValue as "Parlay" | "Teaser")
                  }
                  data={[
                    { label: "Parlay", value: "Parlay" },
                    { label: "Teaser", value: "Teaser" },
                  ]}
                />
              </div>
            )}
            {parlayOrTeaser === "Teaser" && (
              <div className={classes.betTypeSelect}>
                <NativeSelect
                  data={[
                    `6 (${convertOddsFromDecimal(TEASER_LEG_ODDS[6])} per leg)`,
                    `6.5 (${convertOddsFromDecimal(
                      TEASER_LEG_ODDS[6.5]
                    )} per leg)`,
                    `7 (${convertOddsFromDecimal(TEASER_LEG_ODDS[7])} per leg)`,
                    `7.5 (${convertOddsFromDecimal(
                      TEASER_LEG_ODDS[7.5]
                    )} per leg)`,
                    `8 (${convertOddsFromDecimal(TEASER_LEG_ODDS[8])} per leg)`,
                    `8.5 (${convertOddsFromDecimal(
                      TEASER_LEG_ODDS[8.5]
                    )} per leg)`,
                    `9 (${convertOddsFromDecimal(TEASER_LEG_ODDS[9])} per leg)`,
                    `9.5 (${convertOddsFromDecimal(
                      TEASER_LEG_ODDS[9.5]
                    )} per leg)`,
                    `10 (${convertOddsFromDecimal(
                      TEASER_LEG_ODDS[10]
                    )} per leg)`,
                  ]}
                  label="Teaser points"
                  value={`${teaserPoints} (${convertOddsFromDecimal(
                    TEASER_LEG_ODDS[teaserPoints]
                  )} per leg)`}
                  onChange={(newValue) =>
                    setTeaserPoints(
                      parseFloat(
                        newValue.target.value.split(" ")[0]
                      ) as TeaserPointOption
                    )
                  }
                />
              </div>
            )}
          </>
        )}
        <div className={classes.betSlipOdds}>
          {betOdds > 1 &&
            `${
              betLegs.length === 1
                ? "Straight"
                : parlayOrTeaser === "Parlay"
                ? "Parlay"
                : "Teaser"
            } Bet: ${convertOddsFromDecimal(betOdds)}`}
        </div>
        <div>{betSlipItems}</div>
        {betLegs.length > 0 && clearBetSlipButton}
        <div className={classes.availableBalance}>
          Available balance: {formatCurrency(availableBalance, 2)}
        </div>
        <div className={classes.keepHeight}>
          {availableBalance >= 1 && wager !== availableBalance && allInButton}
          <NumberInput
            className={classes.wager}
            value={wagerDisplayValue}
            label="Wager"
            precision={2}
            error={wagerErrorMessage}
            min={0}
            onChange={(newValue) => setWager(newValue || 0)}
            styles={() => ({
              label: { fontSize: "16px" },
              input: { fontSize: "16px" },
            })}
          />
        </div>
        {toWinAmount > 0 && (
          <div className={classes.toWin}>
            To win: {formatCurrency(toWinAmount, 2)}
          </div>
        )}
        {placeBetButton}
        <div className={classes.betSlipBottom}></div>
      </Aside.Section>
    </Aside>
  );

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | Place Bets</title>
      </Helmet>
      <div className={classes.title}>Place Bets</div>
      {showBetSlipButton}
      {gameElements.length === 0 && (
        <div className={classes.message}>No games available to bet.</div>
      )}
      {gameElements.length > 0 && (
        <Table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.hideForMobile}>Time</th>
              <th style={{ textAlign: "center" }}>Game</th>
              <th style={{ textAlign: "center" }}>Spread</th>
              <th style={{ textAlign: "center" }}>ML</th>
              <th style={{ textAlign: "center" }}>Total</th>
            </tr>
          </thead>
          <tbody>{gameElements}</tbody>
        </Table>
      )}

      {showBetSlipButton}
      {betSlip}
    </div>
  );
};
