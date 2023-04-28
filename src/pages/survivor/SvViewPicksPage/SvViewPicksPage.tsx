import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useSvGetUserEntryAndNullablePicks } from "../../../hooks/survivor/useSvGetUserEntryAndNullablePicks";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { AuthContext } from "../../../store/auth-context";
import { Helmet } from "react-helmet-async";
import { formatUsernamePossessiveForm } from "../../../util/format";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { Table } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { Result } from "../../../types/Result";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvViewPicksPage.module.css";

export const SvViewPicksPage = () => {
  const { googleJwt } = useContext(AuthContext);
  const { username } = useParams();

  const { data: allUsernames } = useGetAllUsernames();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();

  const { data: entryData } = useSvGetUserEntryAndNullablePicks(
    googleJwt,
    username
  );

  if (!allUsernames || !currentWeekNumber) {
    return <LoadingSpinner type="primary" />;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div>Invalid username in URL.</div>;
  }

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
            <img
              className={`${classes.logo} ${classes.hiddenLogo}`}
              src={require("../../../assets/mystery_team.png")}
              alt="Mystery Team"
            />
          </td>
          <td>
            <img
              className={`${classes.logo} ${classes.hiddenLogo}`}
              src={require("../../../assets/mystery_team.png")}
              alt="Mystery Team"
            />
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

  const pageTitle = `${formatUsernamePossessiveForm(username)} Survivor Picks`;

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | {pageTitle}</title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>{pageTitle}</div>

      {!entryData && <LoadingSpinner type="secondary" />}
      {rows !== undefined && (
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
