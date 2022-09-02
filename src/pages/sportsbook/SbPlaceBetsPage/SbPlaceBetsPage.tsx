import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../../store/auth-context";
import {
  Aside,
  Button,
  NumberInput,
  ScrollArea,
  SimpleGrid,
} from "@mantine/core";
import classes from "./SbPlaceBetsPage.module.css";
import { useGetCurrentGameLines } from "../../../hooks/useGetCurrentGameLines";
import { SbPlaceBetGame } from "../../../components/SbPlaceBetGame/SbPlaceBetGame";
import { toast } from "react-toastify";
import { useSbPlaceBet } from "../../../hooks/sportsbook/useSbPlaceBet";
import { SbBetLegCreate } from "../../../types/sportsbook/SbBetCreate";
import { useSbGetUserPools } from "../../../hooks/sportsbook/useSbGetUserPools";
import { SbBetLegType } from "../../../types/sportsbook/SbBetLegType";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import {
  convertOddsFromDecimal,
  formatCurrency,
  formatSpread,
} from "../../../util/format";
import { IconTrash } from "@tabler/icons";

export const SbPlaceBetsPage = () => {
  const { googleJwt, username } = useContext(AuthContext);
  // always shown on screens >992px
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [wager, setWager] = useState(0);
  const [betLegs, setBetLegs] = useState<SbBetLegCreate[]>([]);

  const { data: currentWeekGameLines } = useGetCurrentGameLines();
  const { data: currentAccountBalance, refetch: refetchAccountBalance } =
    useSbGetUserPools(username);
  const { mutateAsync: placeBet } = useSbPlaceBet(googleJwt, {
    wager,
    betLegs,
  });

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

  const addBetLeg = ({ gameId, betLegType }: SbBetLegCreate) => {
    const gameLine = currentWeekGameLines.find(
      (game) => game.gameId === gameId
    );
    if (!gameLine) {
      return;
    }
    if (gameLine.timestamp < Date.now()) {
      return;
    }
    // if defined, user is only un-selecting bet leg
    const existingBetLeg = betLegs.find(
      (betLeg) => betLeg.gameId === gameId && betLeg.betLegType === betLegType
    );
    // either way, existing bet legs for this game should be removed
    setBetLegs((prevBetLegs) =>
      prevBetLegs.filter((betLeg) => betLeg.gameId !== gameId)
    );
    // if new bet leg was selected, add it
    if (!existingBetLeg) {
      setBetLegs((prevBetLegs) => [...prevBetLegs, { gameId, betLegType }]);
    }
  };

  const gameElements = currentWeekGameLines.map((line) => {
    let selectedBet;
    const existingBetLeg = betLegs.find(
      (betLeg) => betLeg.gameId === line.gameId
    );
    if (existingBetLeg) {
      selectedBet = existingBetLeg.betLegType;
    }
    return (
      <SbPlaceBetGame
        key={line.gameId}
        {...line}
        selected={selectedBet}
        addBetLeg={addBetLeg}
      />
    );
  });

  const pickEmOdds = 1.9090909;
  const pickEmOddsString = convertOddsFromDecimal(pickEmOdds);
  let betOdds = 1;
  const betSlipItems = betLegs
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
      if (betLegType === SbBetLegType.HOME_SPREAD) {
        betOdds *= pickEmOdds;
        logoToShow = "home";
        textToShow = `${homeTeam.split("_").pop()} ${formatSpread(
          homeSpread
        )} ${pickEmOddsString}`;
      } else if (betLegType === SbBetLegType.AWAY_SPREAD) {
        betOdds *= pickEmOdds;
        logoToShow = "away";
        textToShow = `${awayTeam.split("_").pop()} ${formatSpread(
          homeSpread * -1
        )} ${pickEmOddsString}`;
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
        betOdds *= pickEmOdds;
        logoToShow = "both";
        textToShow = `Over ${gameTotal.toFixed(1)} ${pickEmOddsString}`;
      } else if (betLegType === SbBetLegType.UNDER_TOTAL) {
        betOdds *= pickEmOdds;
        logoToShow = "both";
        textToShow = `Under ${gameTotal.toFixed(1)} ${pickEmOddsString}`;
      }

      return (
        <div key={gameId} className={classes.betSlipItem}>
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
          .promise(placeBet(), {
            pending: "Placing your bet...",
            success: "Successfully placed your bet!",
            error: "Error placing your bet!",
          })
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
      <Aside className={hideBetSlip} p="md" width={{ md: 300 }}>
        <Aside.Section grow component={ScrollArea} type="never">
          {closeBetSlipButton}
          <div className={classes.betSlip}>BET SLIP</div>
          {betLegs.length === 0 && (
            <div className={classes.noBets}>No bets selected.</div>
          )}
          <div className={classes.betSlipOdds}>
            {betOdds > 1 &&
              `${
                betLegs.length === 1 ? "Straight" : "Parlay"
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
            />
          </div>
          {toWinAmount > 0 && (
            <div className={classes.toWin}>
              To win: ${toWinAmount.toFixed(2)}
            </div>
          )}
          {placeBetButton}
        </Aside.Section>
      </Aside>
    </div>
  );
};
