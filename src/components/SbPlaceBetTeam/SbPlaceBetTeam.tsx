import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { SbBetLegCreate } from "../../types/sportsbook/SbBetLegCreate";
import { SbBetLegType } from "../../types/sportsbook/SbBetLegType";
import {
  convertOddsFromDecimal,
  formatSpread,
  formatTeamName,
} from "../../util/format";
import classes from "./SbPlaceBetTeam.module.css";

interface SbPlaceBetTeamProps {
  gameId: number;
  isHomeTeam: boolean;
  isOver: boolean;
  teamName: keyof typeof AllTeamLogos;
  spread: number;
  moneyline: number;
  total: number;
  hasStarted: boolean;
  score: number | null;
  selected?: SbBetLegType[];
  addBetLeg: ({ gameId, betLegType }: SbBetLegCreate) => void;
}

export const SbPlaceBetTeam = ({
  gameId,
  isHomeTeam,
  isOver,
  teamName,
  spread,
  moneyline,
  total,
  hasStarted,
  score,
  selected,
  addBetLeg,
}: SbPlaceBetTeamProps) => {
  const teamClasses = `${classes.choice} ${hasStarted ? classes.started : ""}`;
  const spreadClasses = `${classes.betOption} ${
    isHomeTeam && selected?.includes(SbBetLegType.HOME_SPREAD)
      ? classes.selected
      : !isHomeTeam && selected?.includes(SbBetLegType.AWAY_SPREAD)
      ? classes.selected
      : ""
  } ${hasStarted ? classes.started : classes.notStarted}`;
  const moneylineClasses = `${classes.betOption} ${
    isHomeTeam && selected?.includes(SbBetLegType.HOME_MONEYLINE)
      ? classes.selected
      : !isHomeTeam && selected?.includes(SbBetLegType.AWAY_MONEYLINE)
      ? classes.selected
      : ""
  } ${hasStarted ? classes.started : classes.notStarted}`;
  const totalClasses = `${classes.betOption} ${
    isOver && selected?.includes(SbBetLegType.OVER_TOTAL)
      ? classes.selected
      : !isOver && selected?.includes(SbBetLegType.UNDER_TOTAL)
      ? classes.selected
      : ""
  } ${hasStarted ? classes.started : classes.notStarted}`;

  const spreadType = isHomeTeam
    ? SbBetLegType.HOME_SPREAD
    : SbBetLegType.AWAY_SPREAD;

  const moneylineType = isHomeTeam
    ? SbBetLegType.HOME_MONEYLINE
    : SbBetLegType.AWAY_MONEYLINE;

  const totalType = isOver ? SbBetLegType.OVER_TOTAL : SbBetLegType.UNDER_TOTAL;

  const pickEmOddsString = convertOddsFromDecimal(1.9090909);

  return (
    <div className={teamClasses}>
      <img
        className={classes.logo}
        src={AllTeamLogos[teamName] as unknown as string}
        alt={teamName}
      />
      <div className={classes.teamName}>{formatTeamName(teamName)}</div>
      <div
        className={spreadClasses}
        onClick={() => addBetLeg({ gameId, betLegType: spreadType })}
      >
        {formatSpread(spread)} {pickEmOddsString}
      </div>
      <div
        className={moneylineClasses}
        onClick={() => addBetLeg({ gameId, betLegType: moneylineType })}
      >
        ML {convertOddsFromDecimal(moneyline)}
      </div>
      <div
        className={totalClasses}
        onClick={() => addBetLeg({ gameId, betLegType: totalType })}
      >
        {isOver
          ? `O${total.toFixed(1)} ${pickEmOddsString}`
          : `U${total.toFixed(1)} ${pickEmOddsString}`}
      </div>
      {score !== null && <div className={classes.score}>{score}</div>}
    </div>
  );
};
