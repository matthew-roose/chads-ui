import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useSvGetUserEntryAndNullablePicks } from "../../../hooks/survivor/useSvGetUserEntryAndNullablePicks";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { ChadContext } from "../../../store/chad-context";
import { Helmet } from "react-helmet-async";
import { formatUsernamePossessiveForm } from "../../../util/format";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { Table } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvViewPicksPage.module.css";

export const SvViewPicksPage = () => {
  const { googleJwt } = useContext(ChadContext);
  const { username } = useParams();

  const { data: allUsernames } = useGetAllUsernames();

  const { data: entryData } = useSvGetUserEntryAndNullablePicks(
    googleJwt,
    username
  );

  const rows = entryData?.picks.map((pick) => {
    const {
      weekNumber,
      pickedTeam,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      result,
    } = pick;
    if (!pickedTeam || !homeTeam || !awayTeam) {
      return (
        <tr className={classes.row} key={weekNumber}>
          <td>{weekNumber}</td>
          <td>
            <div
              className={classes.logoBackdrop}
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <img
                className={`${classes.logo} ${classes.hiddenLogo}`}
                src={require("../../../assets/mystery_team.png")}
                alt="Mystery Team"
              />
            </div>
          </td>
          <td>
            <div
              className={classes.logoBackdrop}
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <img
                className={`${classes.logo} ${classes.hiddenLogo}`}
                src={require("../../../assets/mystery_team.png")}
                alt="Mystery Team"
              />
            </div>
          </td>
          <td></td>
          <td></td>
        </tr>
      );
    }
    const opposingTeam = pickedTeam === homeTeam ? awayTeam : homeTeam;
    const formattedScore =
      homeScore !== null
        ? pickedTeam === homeTeam
          ? `${homeScore}-${awayScore}`
          : `${awayScore}-${homeScore}`
        : "";
    let winLossFillClassName;
    let winLossTextClassName;
    if (result === Result.WIN) {
      winLossFillClassName = classes.winFill;
      winLossTextClassName = classes.winText;
    } else if (result === Result.LOSS) {
      winLossFillClassName = classes.lossFill;
      winLossTextClassName = classes.lossText;
    } else if (result === Result.PUSH) {
      winLossFillClassName = classes.pushFill;
      winLossTextClassName = classes.pushText;
    }
    return (
      <tr className={classes.row} key={weekNumber}>
        <td>{weekNumber}</td>
        <td>
          <div className={`${classes.logoBackdrop} ${winLossFillClassName}`}>
            <img
              className={classes.logo}
              src={AllTeamLogos[pickedTeam] as unknown as string}
              alt={pickedTeam}
            />
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
        <td className={classes.hideForMobile}>{formattedScore}</td>
        <td className={winLossTextClassName}>{result}</td>
      </tr>
    );
  });

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/survivor/pick-history/${username}`;
  };

  const isInvalidUsername =
    !username || (allUsernames && !allUsernames.includes(username));

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | Survivor | {formatUsernamePossessiveForm(username || "")}{" "}
          Picks
        </title>
      </Helmet>
      <UserSelect
        username={username || ""}
        allUsernames={allUsernames || []}
        getNavigateUrl={getNavigateUrl}
      />
      {!isInvalidUsername && (
        <div className={classes.title}>
          {formatUsernamePossessiveForm(username || "")} Picks
        </div>
      )}
      {isInvalidUsername && (
        <div className={classes.message}>Invalid username in URL.</div>
      )}
      {!entryData && <LoadingSpinner />}
      {!isInvalidUsername && rows?.length === 0 && (
        <div className={classes.message}>No picks yet.</div>
      )}
      {rows && rows.length > 0 && (
        <Table className={classes.table}>
          <thead>
            <tr>
              <th>Week</th>
              <th>Pick</th>
              <th>Opponent</th>
              <th className={classes.hideForMobile}>Score</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
    </div>
  );
};
