import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../../types/Result";
import { formatSpread, formatTimestamp } from "../../util/format";
import classes from "./ScViewPicksGame.module.css";

interface ScViewPicksGameProps {
  gameId: number | null;
  timestamp: number | null;
  pickedTeam: keyof typeof AllTeamLogos | null;
  homeTeam: keyof typeof AllTeamLogos | null;
  awayTeam: keyof typeof AllTeamLogos | null;
  homeSpread: number | null;
  homeScore: number | null;
  awayScore: number | null;
  result: Result | null;
}

export const ScViewPicksGame = ({
  gameId,
  timestamp,
  pickedTeam,
  homeTeam,
  awayTeam,
  homeSpread,
  homeScore,
  awayScore,
  result,
}: ScViewPicksGameProps) => {
  // not logged in as this user should it should be a mystery until final
  if (
    !gameId ||
    !timestamp ||
    !pickedTeam ||
    !homeTeam ||
    !awayTeam ||
    !homeSpread
  ) {
    return (
      <tr>
        <td className={`${classes.timestamp} ${classes.hideForMobile}`}>
          Not started
        </td>
        <td>
          <div className={classes.mobileOnly}>Not started</div>
          <div className={classes.teams}>
            <div className={classes.teamDiv}>
              <img
                className={classes.logo}
                src={require("../../assets/mystery_team.png")}
                alt="Mystery"
              />
            </div>
            <div className={classes.at}>@</div>
            <div className={classes.teamDiv}>
              <img
                className={classes.logo}
                src={require("../../assets/mystery_team.png")}
                alt="Mystery"
              />
            </div>
          </div>
        </td>
      </tr>
    );
  }

  const homeClasses = `${classes.teamDiv} ${
    homeTeam === pickedTeam
      ? result
        ? result === Result.WIN
          ? classes.win
          : result === Result.LOSS
          ? classes.loss
          : classes.push
        : classes.pending
      : ""
  }`;
  const awayClasses = `${classes.teamDiv} ${
    awayTeam === pickedTeam
      ? result
        ? result === Result.WIN
          ? classes.win
          : result === Result.LOSS
          ? classes.loss
          : classes.push
        : classes.pending
      : ""
  }`;

  return (
    <tr>
      <td className={`${classes.timestamp} ${classes.hideForMobile}`}>
        {formatTimestamp(timestamp, true)}
      </td>
      <td>
        <div className={classes.mobileOnly}>
          {formatTimestamp(timestamp, true)}
        </div>
        <div className={classes.teams}>
          <div className={awayClasses}>
            <div className={classes.logoAndSpread}>
              <img
                className={classes.logo}
                src={AllTeamLogos[awayTeam] as unknown as string}
                alt={awayTeam}
              />
              <span className={classes.spread}>
                {formatSpread(homeSpread * -1)}
              </span>
            </div>
            <div className={classes.score}>{awayScore}</div>
          </div>
          <div className={classes.at}>@</div>
          <div className={homeClasses}>
            <div className={classes.logoAndSpread}>
              <img
                className={classes.logo}
                src={AllTeamLogos[homeTeam] as unknown as string}
                alt={homeTeam}
              />
              <span className={classes.spread}>{formatSpread(homeSpread)}</span>
            </div>
            <div className={classes.score}>{homeScore}</div>
          </div>
        </div>
      </td>
    </tr>
  );
};
