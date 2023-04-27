import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";

import { Button, Group, Table } from "@mantine/core";
import { toast } from "react-toastify";

import { ScMakePicksGame } from "../../../components/ScMakePicksGame/ScMakePicksGame";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useGetCurrentGameLines } from "../../../hooks/useGetCurrentGameLines";
import { useScGetUserEntryWeekAndPicks } from "../../../hooks/supercontest/useScGetUserEntryWeekAndPicks";
import { useScSubmitPicks } from "../../../hooks/supercontest/useScSubmitPicks";
import { AuthContext } from "../../../store/auth-context";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { ScPickCreate } from "../../../types/supercontest/ScPickCreate";
import { Result } from "../../../types/Result";
import classes from "./ScMakePicksPage.module.css";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const ScMakePicksPage = () => {
  const { googleJwt, username } = useContext(AuthContext);
  const [currentPicks, setCurrentPicks] = useState<ScPickCreate[]>([]);

  const { data: currentWeekNumber } = useGetCurrentWeekNumber();

  const { data: gameLinesData } = useGetCurrentGameLines();

  const { data: existingEntryWeekData, refetch: refetchExistingEntryWeekData } =
    useScGetUserEntryWeekAndPicks(googleJwt, username, currentWeekNumber);

  const submitPicks = useScSubmitPicks();

  useEffect(() => {
    if (existingEntryWeekData) {
      setCurrentPicks(
        existingEntryWeekData.picks.map((pick) => {
          return {
            gameId: pick.gameId,
            pickedTeam: pick.pickedTeam,
            result: pick.result,
          };
        })
      );
    }
  }, [existingEntryWeekData]);

  if (!googleJwt || !username) {
    return (
      <div className={classes.notSignedIn}>Please sign in to make picks.</div>
    );
  }

  if (!gameLinesData || !existingEntryWeekData) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  const addPickHandler = (newPick: ScPickCreate) => {
    const game = gameLinesData.find(
      (gameLine) => gameLine.gameId === newPick.gameId
    );
    if (game && game.timestamp <= Date.now()) {
      return;
    }
    // was either team previously picked?
    const prevPickedGamePick = currentPicks.find(
      (pick) => pick.gameId === newPick.gameId
    );
    // if either team wasn't picked before, can just add the new team
    if (!prevPickedGamePick) {
      if (currentPicks.length < 5) {
        setCurrentPicks((prevPicks) =>
          [...prevPicks, newPick].sort((a, b) => a.gameId - b.gameId)
        );
      } else {
        // 5 picks already selected
        alert("5 picks already made.");
        return;
      }
    } else {
      // whether switching teams or unselecting team, need to remove original pick
      setCurrentPicks((prevPicks) =>
        prevPicks.filter((pick) => pick.gameId !== newPick.gameId)
      );
      // need to add new team if switching teams for the game
      if (prevPickedGamePick.pickedTeam !== newPick.pickedTeam) {
        setCurrentPicks((prevPicks) =>
          [...prevPicks, newPick].sort((a, b) => a.gameId - b.gameId)
        );
      }
    }
  };

  const gameLines = gameLinesData.map((gameLine) => {
    let pickedTeam;
    let result;
    // was this game previously picked?
    const pickedGame = currentPicks.find(
      (pick) => pick.gameId === gameLine.gameId
    );
    if (pickedGame) {
      pickedTeam = pickedGame.pickedTeam;
      result = pickedGame.result;
    }

    return (
      <ScMakePicksGame
        key={gameLine.gameId}
        {...gameLine}
        pickedTeam={pickedTeam}
        result={result}
        onPickTeam={addPickHandler}
      />
    );
  });

  const currentPicksLogos = currentPicks.map((pick) => {
    const currentPicksLogoClasses = `${classes.currentPickLogo} ${
      pick.result
        ? pick.result === Result.WIN
          ? classes.win
          : pick.result === Result.LOSS
          ? classes.loss
          : pick.result === Result.PUSH
          ? classes.push
          : ""
        : ""
    }`;
    return (
      <img
        key={pick.pickedTeam}
        className={currentPicksLogoClasses}
        src={AllTeamLogos[pick.pickedTeam] as unknown as string}
        alt={pick.pickedTeam}
      />
    );
  });

  const existingPicks = existingEntryWeekData.picks.map((pick) => {
    return {
      gameId: pick.gameId,
      pickedTeam: pick.pickedTeam,
      result: pick.result,
    };
  });

  const submitButton = (
    <Button
      disabled={
        JSON.stringify(existingPicks.map((pick) => pick.pickedTeam)) ===
        JSON.stringify(currentPicks.map((pick) => pick.pickedTeam))
      }
      variant="gradient"
      gradient={{ from: "teal", to: "lime" }}
      className={classes.submitButton}
      onClick={() =>
        toast
          .promise(
            submitPicks.mutateAsync({ googleJwt, picks: currentPicks }),
            {
              pending: "Saving your picks...",
              success: "Successfully saved your picks!",
              error: "Error saving your picks!",
            }
          )
          .then(() => refetchExistingEntryWeekData())
      }
    >
      Submit Picks
    </Button>
  );

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Make SC Picks</title>
      </Helmet>
      <Group className={classes.currentPickLogoGroup} position="center">
        {currentPicksLogos}
      </Group>
      {submitButton}
      <Table className={classes.table}>
        <thead>
          <tr>
            <th></th>
            <th className={classes.hideForMobile}></th>
          </tr>
        </thead>
        <tbody>{gameLines}</tbody>
      </Table>
      <Group className={classes.currentPickLogoGroup} position="center">
        {currentPicksLogos}
      </Group>
      {submitButton}
    </div>
  );
};
