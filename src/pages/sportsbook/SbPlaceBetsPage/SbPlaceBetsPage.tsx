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
  SimpleGrid,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { toast } from "react-toastify";
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
import classes from "./SbPlaceBetsPage.module.css";
import { TEASER_LEG_ODDS } from "../../../util/constants";

export const SbPlaceBetsPage = () => {
  const { googleJwt, username } = useContext(AuthContext);
  // only used for screens <993px
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [parlayOrTeaser, setParlayOrTeaser] = useState<"Parlay" | "Teaser">(
    "Parlay"
  );
  const [teaserPoints, setTeaserPoints] = useState(6);
  const [wager, setWager] = useState(0);
  const [betLegs, setBetLegs] = useState<SbBetLegCreate[]>([]);

  const { data: currentWeekGameLines } = useGetCurrentGameLines();
  const { data: currentAccountBalance, refetch: refetchAccountBalance } =
    useSbGetUserPools(username);

  const placeBet = useSbPlaceBet();

  if (!googleJwt || !username) {
    return (
      <div className={classes.notSignedIn}>Please sign in to place bets.</div>
    );
  }

  if (!currentWeekGameLines || !currentAccountBalance) {
    return null;
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
          selected={selectedBets}
          addBetLeg={addBetLeg}
        />
      );
    });

  const spreadAndTotalOdds =
    betLegs.length === 1 || parlayOrTeaser === "Parlay"
      ? 1.90909
      : TEASER_LEG_ODDS[
          teaserPoints as 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10
        ];
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
      let logoToShow;
      let textToShow;
      const teaserPointsIfApplicable =
        parlayOrTeaser === "Teaser" ? teaserPoints : 0;
      if (betLegType === SbBetLegType.HOME_SPREAD) {
        betOdds *= spreadAndTotalOdds;
        logoToShow = "home";
        textToShow = `${homeTeam.split("_").pop()} ${formatSpread(
          homeSpread + teaserPointsIfApplicable
        )} ${spreadAndTotalOddsString}`;
      } else if (betLegType === SbBetLegType.AWAY_SPREAD) {
        betOdds *= spreadAndTotalOdds;
        logoToShow = "away";
        textToShow = `${awayTeam.split("_").pop()} ${formatSpread(
          homeSpread * -1 + teaserPointsIfApplicable
        )} ${spreadAndTotalOddsString}`;
      } else if (betLegType === SbBetLegType.HOME_MONEYLINE) {
        betOdds *= homeMoneyline;
        logoToShow = "home";
        textToShow = `${homeTeam.split("_").pop()} ML ${convertOddsFromDecimal(
          homeMoneyline
        )}`;
      } else if (betLegType === SbBetLegType.AWAY_MONEYLINE) {
        betOdds *= awayMoneyline;
        logoToShow = "away";
        textToShow = `${awayTeam.split("_").pop()} ML ${convertOddsFromDecimal(
          awayMoneyline
        )}`;
      } else if (betLegType === SbBetLegType.OVER_TOTAL) {
        betOdds *= spreadAndTotalOdds;
        logoToShow = "both";
        textToShow = `Over ${(gameTotal - teaserPointsIfApplicable).toFixed(
          1
        )} ${spreadAndTotalOddsString}`;
      } else if (betLegType === SbBetLegType.UNDER_TOTAL) {
        betOdds *= spreadAndTotalOdds;
        logoToShow = "both";
        textToShow = `Under ${(gameTotal + teaserPointsIfApplicable).toFixed(
          1
        )} ${spreadAndTotalOddsString}`;
      }

      return (
        <div key={`${gameId}${betLegType}`} className={classes.betSlipItem}>
          <div className={classes.betSlipItemLogoAndText}>
            {logoToShow === "home" && (
              <img
                className={classes.betSlipItemLogo}
                src={AllTeamLogos[homeTeam] as unknown as string}
                alt={homeTeam}
              />
            )}
            {logoToShow === "away" && (
              <img
                className={classes.betSlipItemLogo}
                src={AllTeamLogos[awayTeam] as unknown as string}
                alt={awayTeam}
              />
            )}
            {logoToShow === "both" && (
              <>
                <img
                  className={classes.betSlipItemLogo}
                  src={AllTeamLogos[awayTeam] as unknown as string}
                  alt={awayTeam}
                />
                <img
                  className={classes.betSlipItemLogo}
                  src={AllTeamLogos[homeTeam] as unknown as string}
                  alt={homeTeam}
                />
              </>
            )}
            <div className={classes.betSlipItemText}>{textToShow}</div>
          </div>

          <IconTrash
            className={classes.deleteLegIcon}
            size={24}
            color="red"
            onClick={() =>
              setBetLegs((prevState) =>
                prevState.filter(
                  (oldBetLeg) => oldBetLeg.gameId !== betLeg.gameId
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
    <Aside className={hideBetSlip} p="md" width={{ md: 300 }}>
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
                  data={["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"]}
                  label="Teaser points"
                  value={teaserPoints}
                  onChange={(newValue) =>
                    setTeaserPoints(parseFloat(newValue.target.value))
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
          Available balance: $
          {currentAccountBalance.availableBalance.toFixed(2)}
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
          <div className={classes.toWin}>To win: ${toWinAmount.toFixed(2)}</div>
        )}
        {placeBetButton}
        <div style={{ height: "10rem" }}></div>
      </Aside.Section>
    </Aside>
  );

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Place Bets</title>
      </Helmet>
      {showBetSlipButton}
      <SimpleGrid
        p="xl"
        cols={2}
        spacing={20}
        breakpoints={[{ maxWidth: 1300, cols: 1 }]}
      >
        {gameElements}
      </SimpleGrid>
      {showBetSlipButton}
      {betSlip}
    </div>
  );
};
