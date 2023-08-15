import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Divider } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { useSbGetUserSeasonBreakdown } from "../../../hooks/sportsbook/useSbGetUserSeasonBreakdown";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { formatUsernamePossessiveForm } from "../../../util/format";
import { SbSeasonBreakdownTable } from "../../../components/SbSeasonBreakdownTable/SbSeasonBreakdownTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbUserSeasonBreakdownPage.module.css";

export const SbUserSeasonBreakdownPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: seasonBreakdownData } = useSbGetUserSeasonBreakdown(username);

  let pickedTeamDataArray;
  let fadedTeamDataArray;
  let totalDataArray;
  let betTypeDataArray;

  if (seasonBreakdownData) {
    // turn maps into arrays
    const pickedTeamData = seasonBreakdownData.winsAndLossesByPickedTeam;
    const pickedTeams = Object.keys(pickedTeamData);
    pickedTeamDataArray = pickedTeams
      .map((team) => {
        return {
          team,
          ...pickedTeamData[team as keyof typeof AllTeamLogos],
        };
      })
      .sort((a, b) => b.amountWagered - a.amountWagered);
    const fadedTeamData = seasonBreakdownData.winsAndLossesByFadedTeam;
    const fadedTeams = Object.keys(fadedTeamData);
    fadedTeamDataArray = fadedTeams
      .map((team) => {
        return {
          team,
          ...fadedTeamData[team as keyof typeof AllTeamLogos],
        };
      })
      .sort((a, b) => b.amountWagered - a.amountWagered);
    const totalData = seasonBreakdownData.winsAndLossesByTotal;
    const totals = Object.keys(totalData);
    totalDataArray = totals
      .map((total) => {
        return {
          total,
          ...totalData[total],
        };
      })
      .sort((a, b) => b.amountWagered - a.amountWagered);
    const betTypeData = seasonBreakdownData.winsAndLossesByBetType;
    const betTypes = Object.keys(betTypeData);
    betTypeDataArray = betTypes
      .map((betType) => {
        return { betType, ...betTypeData[betType] };
      })
      .sort((a, b) => b.amountWagered - a.amountWagered);
  }

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/sportsbook/${username}/stats/season`;
  };

  const isInvalidUsername =
    !username || (allUsernames && !allUsernames.includes(username));
  const hasPickedATeam =
    pickedTeamDataArray !== undefined && pickedTeamDataArray.length > 0;
  const hasPickedATotal =
    totalDataArray !== undefined && totalDataArray[0].amountWagered > 0;

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | Sportsbook | {formatUsernamePossessiveForm(username || "")}{" "}
          Season Breakdown
        </title>
      </Helmet>
      <UserSelect
        username={username || ""}
        allUsernames={allUsernames || []}
        getNavigateUrl={getNavigateUrl}
      />
      {!isInvalidUsername && (
        <div className={classes.title}>
          {formatUsernamePossessiveForm(username || "")} Season Breakdown
        </div>
      )}
      {isInvalidUsername && (
        <div className={classes.message}>Invalid username in URL.</div>
      )}
      {!seasonBreakdownData && <LoadingSpinner />}
      {!isInvalidUsername && (hasPickedATeam || hasPickedATotal) && (
        <div className={classes.parlayMessage}>
          *For parlay legs, the amount won is calculated as the wager multipled
          by the leg's individual odds.
        </div>
      )}
      {!isInvalidUsername &&
        seasonBreakdownData &&
        !hasPickedATeam &&
        !hasPickedATotal && <div className={classes.message}>No bets yet.</div>}
      {hasPickedATeam && (
        <>
          <SbSeasonBreakdownTable
            caption="Favorite Teams to Bet"
            firstColumnName="Team"
            rows={pickedTeamDataArray || []}
          />
          <Divider className={classes.divider} />
        </>
      )}
      {hasPickedATeam && (
        <>
          <SbSeasonBreakdownTable
            caption="Favorite Teams to Fade"
            firstColumnName="Team"
            rows={fadedTeamDataArray || []}
          />
          <Divider className={classes.divider} />
        </>
      )}
      {hasPickedATotal && (
        <>
          <SbSeasonBreakdownTable
            caption="Breakdown by Total"
            firstColumnName="Total"
            rows={totalDataArray || []}
          />
          <Divider className={classes.divider} />
        </>
      )}
      {(hasPickedATeam || hasPickedATotal) && (
        <SbSeasonBreakdownTable
          caption="Breakdown by Bet Type"
          firstColumnName="Bet Type"
          rows={betTypeDataArray || []}
        />
      )}
    </div>
  );
};
