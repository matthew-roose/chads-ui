import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../../types/Result";
import { ScPickCreate } from "../../types/supercontest/ScPickCreate";
import { formatTeamName, formatSpread } from "../../util/format";
import classes from "./ScMakePicksTeam.module.css";

interface ScMakePicksTeamProps {
  gameId: number;
  teamName: keyof typeof AllTeamLogos;
  spread: number;
  isPickedTeam: boolean;
  hasStarted: boolean;
  score: number | null;
  result?: Result | null;
  onPickTeam: (newPick: ScPickCreate) => void;
}

export const ScMakePicksTeam = ({
  gameId,
  teamName,
  spread,
  isPickedTeam,
  hasStarted,
  score,
  result,
  onPickTeam,
}: ScMakePicksTeamProps) => {
  const teamClasses = `${classes.choice} ${
    hasStarted ? classes.started : classes.notStarted
  } ${
    isPickedTeam
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
    <div
      className={teamClasses}
      onClick={() => onPickTeam({ gameId, pickedTeam: teamName })}
    >
      <img
        className={classes.logo}
        src={AllTeamLogos[teamName] as unknown as string}
        alt={teamName}
      />
      <div className={classes.spread}>{formatSpread(spread)}</div>
      <div className={classes.teamName}>{formatTeamName(teamName)}</div>
      {score !== null && <div className={classes.score}>{score}</div>}
    </div>
  );
};
