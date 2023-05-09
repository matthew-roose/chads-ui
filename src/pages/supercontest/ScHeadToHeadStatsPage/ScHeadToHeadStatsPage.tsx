import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Select, Table } from "@mantine/core";
import { ChadContext } from "../../../store/chad-context";
import { useScGetHeadToHeadStats } from "../../../hooks/supercontest/useScGetHeadToHeadStats";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { ScHeadToHeadStats } from "../../../types/supercontest/ScHeadToHeadStats";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { Result } from "../../../types/Result";
import {
  formatRecord,
  formatSpread,
  formatTeamMascot,
  formatUsernamePossessiveForm,
} from "../../../util/format";
import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScHeadToHeadStatsPage.module.css";

export const ScHeadToHeadStatsPage = () => {
  const { username: loggedInUsername, useDarkMode } = useContext(ChadContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstUsername, setFirstUsername] = useState(
    searchParams.get("firstUser") || loggedInUsername || ""
  );
  const [secondUsername, setSecondUsername] = useState(
    searchParams.get("secondUser") || ""
  );

  useEffect(() => {
    if (!searchParams.get("firstUser")) {
      setSearchParams({ firstUser: loggedInUsername });
    }
  }, [searchParams, setSearchParams, loggedInUsername]);

  const { data: allUsernames } = useGetAllUsernames();
  let { data: headToHeadData, isLoading: isHeadToHeadDataLoading } =
    useScGetHeadToHeadStats(firstUsername, secondUsername);

  if (!headToHeadData) {
    headToHeadData = [];
  }

  const userSelects = (
    <form spellCheck={false} className={classes.dropdowns}>
      <Select
        label="First User"
        defaultValue={firstUsername}
        onChange={(newUsername) => {
          setSearchParams({
            firstUser: newUsername || "",
            secondUser: secondUsername,
          });
          setFirstUsername(newUsername || "");
        }}
        data={allUsernames || []}
        searchable
        nothingFound="No users found"
        styles={() => ({
          label: { fontSize: "16px" },
          input: { fontSize: "16px" },
        })}
      />
      <Select
        label="Second User"
        defaultValue={secondUsername}
        onChange={(newUsername) => {
          setSearchParams({
            firstUser: firstUsername,
            secondUser: newUsername || "",
          });
          setSecondUsername(newUsername || "");
        }}
        data={allUsernames || []}
        searchable
        nothingFound="No users found"
        styles={() => ({
          label: { fontSize: "16px" },
          input: { fontSize: "16px" },
        })}
      />
    </form>
  );

  const pickPairs: ScHeadToHeadStats[][] = [];
  for (let i = 0; i < headToHeadData.length; i += 2) {
    pickPairs.push(headToHeadData.slice(i, i + 2));
  }

  const opposingPicks: ScHeadToHeadStats[][] = [];
  const aligningPicks: ScHeadToHeadStats[][] = [];

  pickPairs.forEach((pair) => {
    if (pair[0].pickedTeam !== pair[1].pickedTeam) {
      opposingPicks.push(pair);
    } else {
      aligningPicks.push(pair);
    }
  });

  let firstUserWins = 0;
  let firstUserLosses = 0;
  let firstUserPushes = 0;

  const opposingPicksRows = opposingPicks.map((pair) => {
    const {
      username: usernameCheck,
      gameId,
      weekNumber,
      homeSpread,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
    } = pair[0];

    const firstUser = firstUsername === usernameCheck ? pair[0] : pair[1];
    const secondUser = firstUsername === usernameCheck ? pair[1] : pair[0];

    let score;
    if (homeScore !== null && awayScore !== null) {
      score =
        homeScore > awayScore
          ? `${homeScore}-${awayScore} ${formatTeamMascot(homeTeam)}`
          : homeScore < awayScore
          ? `${awayScore}-${homeScore} ${formatTeamMascot(awayTeam)}`
          : `${homeScore}-${awayScore} Tie`;
    }

    let winner;
    if (homeScore !== null) {
      winner =
        firstUser.result === Result.WIN
          ? firstUser.username
          : secondUser.result === Result.WIN
          ? secondUser.username
          : "PUSH";
    }
    let fillClasses;
    let textClasses;
    if (winner === firstUser.username) {
      firstUserWins++;
      fillClasses = `${classes.winFill} ${useDarkMode ? classes.darkMode : ""}`;
      textClasses = `${classes.winText} ${useDarkMode ? classes.darkMode : ""}`;
    } else if (winner === "PUSH") {
      firstUserPushes++;
      fillClasses = classes.pushFill;
      textClasses = classes.pushText;
    } else {
      firstUserLosses++;
      fillClasses = classes.lossFill;
      textClasses = classes.lossText;
    }

    return (
      <tr className={classes.row} key={gameId}>
        <td className={classes.hideSecondForMobile}>{weekNumber}</td>
        <td>
          <div
            className={`${classes.flexRow} ${classes.logoBackdrop} ${fillClasses}`}
          >
            <img
              className={classes.logo}
              src={AllTeamLogos[firstUser.pickedTeam] as unknown as string}
              alt={firstUser.pickedTeam}
            />
            <span className={classes.spread}>
              {firstUser.pickedTeam === homeTeam
                ? formatSpread(homeSpread)
                : formatSpread(homeSpread * -1)}
            </span>
          </div>
        </td>
        <td>
          <div className={classes.flexRow}>
            <img
              className={classes.logo}
              src={AllTeamLogos[secondUser.pickedTeam] as unknown as string}
              alt={secondUser.pickedTeam}
            />
            <span className={classes.spread}>
              {secondUser.pickedTeam === homeTeam
                ? formatSpread(homeSpread)
                : formatSpread(homeSpread * -1)}
            </span>
          </div>
        </td>
        <td className={textClasses}>{score}</td>
        <td className={`${textClasses} ${classes.hideFirstForMobile}`}>
          {winner}
        </td>
      </tr>
    );
  });

  let alignedWins = 0;
  let alignedLosses = 0;
  let alignedPushes = 0;

  const alignedPicksRows = aligningPicks.map((pair) => {
    const {
      gameId,
      weekNumber,
      pickedTeam,
      homeSpread,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      result,
    } = pair[0];

    let score;
    if (homeScore !== null && awayScore !== null) {
      score =
        homeScore > awayScore
          ? `${homeScore}-${awayScore} ${formatTeamMascot(homeTeam)}`
          : homeScore < awayScore
          ? `${awayScore}-${homeScore} ${formatTeamMascot(awayTeam)}`
          : `${homeScore}-${awayScore} Tie`;
    }

    let fillClasses;
    let textClasses;
    if (result !== null) {
      if (result === Result.WIN) {
        alignedWins++;
        fillClasses = `${classes.winFill} ${
          useDarkMode ? classes.darkMode : ""
        }`;
        textClasses = `${classes.winText} ${
          useDarkMode ? classes.darkMode : ""
        }`;
      } else if (result === Result.LOSS) {
        alignedLosses++;
        fillClasses = classes.lossFill;
        textClasses = classes.lossText;
      } else {
        alignedPushes++;
        fillClasses = classes.pushFill;
        textClasses = classes.pushText;
      }
    }

    const opposingTeam = pickedTeam === homeTeam ? awayTeam : homeTeam;

    return (
      <tr className={classes.row} key={gameId}>
        <td className={classes.hideSecondForMobile}>{weekNumber}</td>
        <td>
          <div
            className={`${classes.flexRow} ${classes.logoBackdrop} ${fillClasses}`}
          >
            <img
              className={classes.logo}
              src={AllTeamLogos[pickedTeam] as unknown as string}
              alt={pickedTeam}
            />
            <span className={classes.spread}>
              {pickedTeam === homeTeam
                ? formatSpread(homeSpread)
                : formatSpread(homeSpread * -1)}
            </span>
          </div>
        </td>
        <td>
          <div>
            <img
              className={classes.logo}
              src={AllTeamLogos[opposingTeam] as unknown as string}
              alt={opposingTeam}
            />
          </div>
        </td>
        <td className={textClasses}>{score}</td>
        <td className={`${textClasses} ${classes.hideFirstForMobile}`}>
          {result}
        </td>
      </tr>
    );
  });

  const invalidSelections =
    firstUsername === secondUsername ||
    firstUsername === "" ||
    secondUsername === "";

  let invalidUsernames;
  if (allUsernames) {
    invalidUsernames =
      (!allUsernames.includes(firstUsername) && firstUsername !== "") ||
      (!allUsernames.includes(secondUsername) && secondUsername !== "");
  }

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Supercontest | H2H Stats</title>
      </Helmet>
      <div className={classes.title}>Head to Head Stats</div>
      {userSelects}
      {invalidSelections && !invalidUsernames && (
        <div className={classes.invalidSelections}>
          Please choose two different users.
        </div>
      )}
      {invalidUsernames && (
        <div className={classes.invalidSelections}>
          Please choose two valid users.
        </div>
      )}
      {!invalidSelections && isHeadToHeadDataLoading && <LoadingSpinner />}
      {!isHeadToHeadDataLoading &&
        !invalidUsernames &&
        opposingPicks.length === 0 &&
        aligningPicks.length === 0 && (
          <div className={classes.noStats}>No stats yet.</div>
        )}
      {!isHeadToHeadDataLoading && opposingPicks.length > 0 && (
        <>
          <div className={classes.title}>
            {formatUsernamePossessiveForm(firstUsername)} Record Against{" "}
            {secondUsername}:{" "}
            {formatRecord(firstUserWins, firstUserLosses, firstUserPushes)}
          </div>
          <Table striped highlightOnHover className={classes.table}>
            <thead>
              <tr>
                <th className={classes.hideSecondForMobile}>Week</th>
                <th>{formatUsernamePossessiveForm(firstUsername)} Pick</th>
                <th>{formatUsernamePossessiveForm(secondUsername)} Pick</th>
                <th>Score</th>
                <th className={classes.hideFirstForMobile}>Winner</th>
              </tr>
            </thead>
            <tbody>{opposingPicksRows}</tbody>
          </Table>
        </>
      )}
      {!isHeadToHeadDataLoading && aligningPicks.length > 0 && (
        <>
          <div className={`${classes.title} ${classes.secondTitle}`}>
            {formatUsernamePossessiveForm(firstUsername)} Record Picking With{" "}
            {secondUsername}:{" "}
            {formatRecord(alignedWins, alignedLosses, alignedPushes)}
          </div>
          <Table striped highlightOnHover className={classes.table}>
            <thead>
              <tr>
                <th className={classes.hideSecondForMobile}>Week</th>
                <th>Pick</th>
                <th>Opponent</th>
                <th>Score</th>
                <th className={classes.hideFirstForMobile}>Result</th>
              </tr>
            </thead>
            <tbody>{alignedPicksRows}</tbody>
          </Table>
        </>
      )}
    </div>
  );
};
