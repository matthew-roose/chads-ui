import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { SbBetLegCreate } from "../../types/sportsbook/SbBetLegCreate";
import { SbBetLegType } from "../../types/sportsbook/SbBetLegType";
import {
  convertOddsFromDecimal,
  formatSpread,
  formatTimestamp,
} from "../../util/format";
import classes from "./SbPlaceBetGame.module.css";

interface SbPlaceBetGameProps {
  gameId: number;
  timestamp: number;
  homeTeam: keyof typeof AllTeamLogos;
  awayTeam: keyof typeof AllTeamLogos;
  homeSpread: number;
  homeMoneyline: number;
  awayMoneyline: number;
  gameTotal: number;
  selectedBets?: SbBetLegType[];
  addBetLeg: ({ gameId, betLegType }: SbBetLegCreate) => void;
}

export const SbPlaceBetGame = ({
  gameId,
  timestamp,
  homeTeam,
  awayTeam,
  homeSpread,
  homeMoneyline,
  awayMoneyline,
  gameTotal,
  selectedBets,
  addBetLeg,
}: SbPlaceBetGameProps) => {
  return (
    <tr className={classes.row}>
      <td className={`${classes.timestamp} ${classes.hideForMobile}`}>
        {formatTimestamp(timestamp, true)}
      </td>
      <td className={classes.timeAndTeams}>
        <div className={classes.mobileOnly}>
          {formatTimestamp(timestamp, true)}
        </div>
        <div>
          <div>
            <img
              className={classes.logo}
              src={AllTeamLogos[awayTeam] as unknown as string}
              alt={awayTeam}
            />
          </div>
          <div>
            <img
              className={classes.logo}
              src={AllTeamLogos[homeTeam] as unknown as string}
              alt={homeTeam}
            />
          </div>
        </div>
      </td>
      <td>
        <div
          onClick={() =>
            addBetLeg({ gameId, betLegType: SbBetLegType.AWAY_SPREAD })
          }
          className={`${classes.line} ${
            selectedBets?.includes(SbBetLegType.AWAY_SPREAD)
              ? classes.selected
              : ""
          }`}
        >
          {formatSpread(homeSpread * -1)} -110
        </div>
        <div
          onClick={() =>
            addBetLeg({ gameId, betLegType: SbBetLegType.HOME_SPREAD })
          }
          className={`${classes.line} ${
            selectedBets?.includes(SbBetLegType.HOME_SPREAD)
              ? classes.selected
              : ""
          }`}
        >
          {formatSpread(homeSpread)} -110
        </div>
      </td>
      <td>
        <div
          onClick={() =>
            addBetLeg({ gameId, betLegType: SbBetLegType.AWAY_MONEYLINE })
          }
          className={`${classes.line} ${
            selectedBets?.includes(SbBetLegType.AWAY_MONEYLINE)
              ? classes.selected
              : ""
          }`}
        >
          {convertOddsFromDecimal(awayMoneyline)}
        </div>
        <div
          onClick={() =>
            addBetLeg({ gameId, betLegType: SbBetLegType.HOME_MONEYLINE })
          }
          className={`${classes.line} ${
            selectedBets?.includes(SbBetLegType.HOME_MONEYLINE)
              ? classes.selected
              : ""
          }`}
        >
          {convertOddsFromDecimal(homeMoneyline)}
        </div>
      </td>
      <td>
        <div
          onClick={() =>
            addBetLeg({ gameId, betLegType: SbBetLegType.OVER_TOTAL })
          }
          className={`${classes.line} ${
            selectedBets?.includes(SbBetLegType.OVER_TOTAL)
              ? classes.selected
              : ""
          }`}
        >
          {`O ${gameTotal.toFixed(1)}`} -110
        </div>
        <div
          onClick={() =>
            addBetLeg({ gameId, betLegType: SbBetLegType.UNDER_TOTAL })
          }
          className={`${classes.line} ${
            selectedBets?.includes(SbBetLegType.UNDER_TOTAL)
              ? classes.selected
              : ""
          }`}
        >
          {`U ${gameTotal.toFixed(1)}`} -110
        </div>
      </td>
    </tr>
  );
};
