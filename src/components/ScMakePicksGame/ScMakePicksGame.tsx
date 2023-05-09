import { useContext } from "react";
import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { formatSpread, formatTimestamp } from "../../util/format";
import { ChadContext } from "../../store/chad-context";
import { ScPickCreate } from "../../types/supercontest/ScPickCreate";
import { Result } from "../../types/Result";
import classes from "./ScMakePicksGame.module.css";

interface ScMakePicksGameProps {
  gameId: number;
  timestamp: number;
  pickedTeam?: keyof typeof AllTeamLogos;
  homeTeam: keyof typeof AllTeamLogos;
  awayTeam: keyof typeof AllTeamLogos;
  homeSpread: number;
  homeScore: number | null;
  awayScore: number | null;
  result?: Result | null;
  onPickTeam: (newPick: ScPickCreate) => void;
}

export const ScMakePicksGame = ({
  gameId,
  timestamp,
  homeTeam,
  awayTeam,
  homeSpread,
  homeScore,
  awayScore,
  pickedTeam,
  result,
  onPickTeam,
}: ScMakePicksGameProps) => {
  const { useDarkMode } = useContext(ChadContext);

  const hasStarted = timestamp <= Date.now();

  const homeClasses = `${classes.teamDiv} ${
    hasStarted ? classes.started : classes.notStarted
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
    hasStarted ? classes.started : classes.notStarted
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
    hasStarted ? classes.started : classes.notStarted
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
          <div
            className={awayClasses}
            onClick={() => onPickTeam({ gameId, pickedTeam: awayTeam })}
          >
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
          <div className={atClasses}>@</div>
          <div
            className={homeClasses}
            onClick={() => onPickTeam({ gameId, pickedTeam: homeTeam })}
          >
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
