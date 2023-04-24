import { Paper } from "@mantine/core";
import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { SbBetLegCreate } from "../../types/sportsbook/SbBetLegCreate";
import { SbBetLegType } from "../../types/sportsbook/SbBetLegType";
import { formatTimestamp } from "../../util/format";
import { SbPlaceBetTeam } from "../SbPlaceBetTeam/SbPlaceBetTeam";
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
  homeScore: number | null;
  awayScore: number | null;
  selected?: SbBetLegType[];
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
  homeScore,
  awayScore,
  selected,
  addBetLeg,
}: SbPlaceBetGameProps) => {
  const hasStarted = timestamp <= Date.now();
  return (
    <Paper
      radius="xl"
      shadow="xl"
      className={hasStarted ? classes.started : ""}
    >
      <div className={classes.gameTime}>{formatTimestamp(timestamp, true)}</div>
      <div className={classes.game}>
        <SbPlaceBetTeam
          gameId={gameId}
          isHomeTeam={false}
          isOver={false}
          teamName={awayTeam}
          spread={homeSpread * -1}
          moneyline={awayMoneyline}
          total={gameTotal}
          hasStarted={timestamp <= Date.now()}
          score={awayScore}
          selected={selected}
          addBetLeg={addBetLeg}
        />
        <p className={classes.at}>@</p>
        <SbPlaceBetTeam
          gameId={gameId}
          isHomeTeam={true}
          isOver={true}
          teamName={homeTeam}
          spread={homeSpread}
          moneyline={homeMoneyline}
          total={gameTotal}
          hasStarted={timestamp <= Date.now()}
          score={homeScore}
          selected={selected}
          addBetLeg={addBetLeg}
        />
      </div>
    </Paper>
  );
};
