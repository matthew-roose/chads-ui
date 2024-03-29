import { Button, Group, Table } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSvGetUserEntryAndPicks } from "../../../hooks/survivor/useSvGetUserEntryAndPicks";
import { useGetCurrentGameLines } from "../../../hooks/useGetCurrentGameLines";
import { ChadContext } from "../../../store/chad-context";
import { SvPickCreate } from "../../../types/survivor/SvPickCreate";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { Result } from "../../../types/Result";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { formatTimestamp } from "../../../util/format";
import { useSvSubmitPick } from "../../../hooks/survivor/useSvSubmitPick";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvMakePickPage.module.css";

export const SvMakePickPage = () => {
  const { googleJwt, username, useDarkMode } = useContext(ChadContext);
  const [currentPick, setCurrentPick] = useState<SvPickCreate>();

  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: gameLinesData } = useGetCurrentGameLines();
  const { data: entryData, refetch: refetchEntryData } =
    useSvGetUserEntryAndPicks(googleJwt, username);

  const submitPick = useSvSubmitPick();

  useEffect(() => {
    if (entryData && currentWeekNumber) {
      const existingPick = entryData.picks.find(
        (pick) => pick.weekNumber === currentWeekNumber
      );
      if (existingPick) {
        const { gameId, pickedTeam, result } = existingPick;
        setCurrentPick({ gameId, pickedTeam, result });
      } else {
        setCurrentPick(undefined);
      }
    }
  }, [entryData, currentWeekNumber]);

  if (!googleJwt || !username) {
    return (
      <div className={classes.notSignedIn}>Please sign in to make a pick.</div>
    );
  }

  const teamsUsed = entryData?.picks
    .filter((pick) => pick.weekNumber !== currentWeekNumber)
    .map((pick) => pick.pickedTeam);

  const prevPickedTeamLogos = teamsUsed?.map((team) => {
    return (
      <div className={`${classes.logoBackdrop}`} key={team}>
        <img
          className={classes.prevPickedLogo}
          src={AllTeamLogos[team] as unknown as string}
          alt={team}
        />
      </div>
    );
  });

  const currentPickLogoClasses = `${classes.currentPickLogo} ${
    currentPick?.result
      ? currentPick?.result === Result.WIN
        ? classes.win
        : currentPick?.result === Result.LOSS
        ? classes.loss
        : currentPick?.result === Result.PUSH
        ? classes.push
        : ""
      : ""
  }`;

  const currentPickLogo = currentPick && (
    <img
      key={currentPick.pickedTeam}
      className={currentPickLogoClasses}
      src={AllTeamLogos[currentPick.pickedTeam] as unknown as string}
      alt={currentPick.pickedTeam}
    />
  );

  const pickedGame = gameLinesData?.find(
    (game) => game.gameId === currentPick?.gameId
  );
  const isPickLocked = pickedGame && pickedGame.timestamp <= Date.now();

  const addPickHandler = (newPick: SvPickCreate) => {
    const game = gameLinesData?.find(
      (gameLine) => gameLine.gameId === newPick.gameId
    );
    if (
      isPickLocked ||
      teamsUsed?.includes(newPick.pickedTeam) ||
      (game && game.timestamp <= Date.now())
    ) {
      return;
    }
    if (currentPick?.pickedTeam === newPick.pickedTeam) {
      setCurrentPick(undefined);
    } else {
      setCurrentPick(newPick);
    }
  };

  const gameRows = gameLinesData?.map((gameLine) => {
    let pickedTeam;
    let result;
    // was this game previously picked?
    const isGamePicked = gameLine.gameId === currentPick?.gameId;
    if (isGamePicked) {
      pickedTeam = currentPick.pickedTeam;
      result = currentPick.result;
    }
    const { gameId, timestamp, homeTeam, awayTeam, homeScore, awayScore } =
      gameLine;
    const hasStarted = timestamp <= Date.now();
    const homeClasses = `${classes.teamDiv} ${
      hasStarted || isPickLocked || teamsUsed?.includes(homeTeam)
        ? classes.started
        : classes.notStarted
    } ${
      homeTeam === pickedTeam
        ? result
          ? result === Result.WIN
            ? classes.win
            : result === Result.LOSS
            ? classes.loss
            : classes.push
          : classes.pending
        : ""
    } ${useDarkMode ? classes.darkMode : ""}`;
    const awayClasses = `${classes.teamDiv} ${
      hasStarted || isPickLocked || teamsUsed?.includes(awayTeam)
        ? classes.started
        : classes.notStarted
    } ${
      awayTeam === pickedTeam
        ? result
          ? result === Result.WIN
            ? classes.win
            : result === Result.LOSS
            ? classes.loss
            : classes.push
          : classes.pending
        : ""
    } ${useDarkMode ? classes.darkMode : ""}`;
    const atClasses = `${classes.at} ${
      hasStarted ||
      isPickLocked ||
      (teamsUsed?.includes(homeTeam) && teamsUsed.includes(awayTeam))
        ? classes.started
        : classes.notStarted
    }`;
    return (
      <tr key={gameId}>
        <td className={`${classes.timestamp} ${classes.hideForMobile}`}>
          {formatTimestamp(timestamp, true)}
        </td>
        <td>
          <div className={classes.mobileOnly}>
            {formatTimestamp(timestamp, true)}
          </div>
          <div className={classes.teams}>
            <div
              className={awayClasses}
              onClick={() => addPickHandler({ gameId, pickedTeam: awayTeam })}
            >
              <img
                className={classes.logo}
                src={AllTeamLogos[awayTeam] as unknown as string}
                alt={awayTeam}
              />
              <div className={classes.score}>{awayScore}</div>
            </div>
            <div className={atClasses}>@</div>
            <div
              className={homeClasses}
              onClick={() => addPickHandler({ gameId, pickedTeam: homeTeam })}
            >
              <img
                className={classes.logo}
                src={AllTeamLogos[homeTeam] as unknown as string}
                alt={homeTeam}
              />
              <div className={classes.score}>{homeScore}</div>
            </div>
          </div>
        </td>
      </tr>
    );
  });

  const submitButton = (
    <Button
      disabled={
        !currentPick ||
        JSON.stringify(
          entryData?.picks.find((pick) => pick.weekNumber === currentWeekNumber)
            ?.pickedTeam
        ) === JSON.stringify(currentPick?.pickedTeam)
      }
      variant="gradient"
      gradient={{ from: "teal", to: "lime" }}
      className={classes.submitButton}
      onClick={() =>
        toast
          .promise(submitPick.mutateAsync({ googleJwt, pick: currentPick }), {
            pending: "Saving your picks...",
            success: "Successfully saved your picks!",
            error: "Error saving your picks!",
          })
          .then(() => refetchEntryData())
      }
    >
      Submit Pick
    </Button>
  );
  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Survivor | Make a Pick</title>
      </Helmet>
      <div className={classes.title}>Make a Survivor Pick</div>
      {!currentWeekNumber || !gameLinesData || !entryData ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={classes.teamsUsed}>
            Teams Already Used: {prevPickedTeamLogos?.length === 0 && "None"}
          </div>
          <Group
            style={{ maxWidth: "600px", margin: "auto" }}
            position="center"
          >
            {prevPickedTeamLogos}
          </Group>
          <div className={classes.currentPick} style={{ display: "flex" }}>
            <div>{`Pick This Week: ${!currentPick ? "None" : ""}`}</div>
            {currentPickLogo}
          </div>
          {submitButton}
          <Table className={classes.table}>
            <thead>
              <tr>
                <th></th>
                <th className={classes.hideForMobile}></th>
              </tr>
            </thead>
            <tbody>{gameRows}</tbody>
          </Table>
          {submitButton}
        </>
      )}
    </div>
  );
};
