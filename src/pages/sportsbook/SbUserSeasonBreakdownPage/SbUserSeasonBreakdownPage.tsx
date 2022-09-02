import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Divider } from "@mantine/core";
import { AllTeamLogos } from "../../../assets/AllTeamLogos";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { useSbGetUserSeasonBreakdown } from "../../../hooks/sportsbook/useSbGetUserSeasonBreakdown";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { formatUsernamePossessiveForm } from "../../../util/format";
import classes from "./SbUserSeasonBreakdownPage.module.css";
import { SbSeasonBreakdownTable } from "../../../components/SbSeasonBreakdownTable/SbSeasonBreakdownTable";

export const SbUserSeasonBreakdownPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: seasonBreakdownData } = useSbGetUserSeasonBreakdown(username);

  if (!allUsernames || !seasonBreakdownData) {
    return null;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div>Invalid username in URL.</div>;
  }

  // turn maps into arrays
  const pickedTeamData = seasonBreakdownData.winsAndLossesByPickedTeam;
  const pickedTeams = Object.keys(pickedTeamData);
  const pickedTeamDataArray = pickedTeams.map((team) => {
    return {
      team,
      ...pickedTeamData[team as keyof typeof AllTeamLogos],
    };
  });
  const fadedTeamData = seasonBreakdownData.winsAndLossesByFadedTeam;
  const fadedTeams = Object.keys(fadedTeamData);
  const fadedTeamDataArray = fadedTeams.map((team) => {
    return {
      team,
      ...fadedTeamData[team as keyof typeof AllTeamLogos],
    };
  });
  const totalData = seasonBreakdownData.winsAndLossesByTotal;
  const totals = Object.keys(totalData);
  const totalDataArray = totals.map((total) => {
    return {
      total,
      ...totalData[total],
    };
  });
  const betTypeData = seasonBreakdownData.winsAndLossesByBetType;
  const betTypes = Object.keys(betTypeData);
  const betTypeDataArray = betTypes.map((betType) => {
    return { betType, ...betTypeData[betType] };
  });

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/sportsbook/${username}/stats/season`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | {formatUsernamePossessiveForm(username)} SB Season Breakdown
        </title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        {formatUsernamePossessiveForm(username)} Season Breakdown
      </div>
      <div className={classes.parlayMessage}>
        *For parlay legs, the amount won is calculated as the wager multipled by
        the leg's individual odds.
      </div>
      <SbSeasonBreakdownTable
        caption="Favorite Teams to Bet"
        firstColumnName="Team"
        rows={pickedTeamDataArray}
      />
      <Divider className={classes.divider} />
      <SbSeasonBreakdownTable
        caption="Favorite Teams to Fade"
        firstColumnName="Team"
        rows={fadedTeamDataArray}
      />
      <Divider className={classes.divider} />
      <SbSeasonBreakdownTable
        caption="Breakdown by Total"
        firstColumnName="Total"
        rows={totalDataArray}
      />
      <Divider className={classes.divider} />
      <SbSeasonBreakdownTable
        caption="Breakdown by Bet Type"
        firstColumnName="Bet Type"
        rows={betTypeDataArray}
      />
    </div>
  );
};
