import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../../types/Result";
import { formatSpread, formatTeamName } from "../../util/format";
import classes from "./ScViewPicksTeam.module.css";

interface ScViewPicksTeamProps {
  teamName: keyof typeof AllTeamLogos;
  spread: number;
  isPickedTeam: boolean;
  score?: number;
  result?: Result;
}

export const ScViewPicksTeam = ({
  teamName,
  spread,
  isPickedTeam,
  score,
  result,
}: ScViewPicksTeamProps) => {
  const teamClasses = `${classes.choice} ${
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
    <div className={teamClasses}>
      <img
        className={classes.logo}
        src={AllTeamLogos[teamName] as unknown as string}
        alt={teamName}
      />
      <div className={classes.spread}>{formatSpread(spread)}</div>
      <div className={classes.teamName}>{formatTeamName(teamName)}</div>
      {score && <div className={classes.score}>{score}</div>}
    </div>
  );
};
