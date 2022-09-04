import { Paper } from "@mantine/core";
import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { ScMakePicksTeam } from "../ScMakePicksTeam/ScMakePicksTeam";
import classes from "./ScMakePicksGame.module.css";
import { formatTimestamp } from "../../util/format";
import { ScPickCreate } from "../../types/supercontest/ScPickCreate";
import { Result } from "../../types/Result";

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
  const hasStarted = timestamp < Date.now();

  return (
    <Paper
      radius="xl"
      shadow="xl"
      className={hasStarted ? classes.started : ""}
    >
      <div className={classes.gameTime}>{formatTimestamp(timestamp, true)}</div>
      <div className={classes.game}>
        <ScMakePicksTeam
          gameId={gameId}
          teamName={awayTeam}
          spread={homeSpread * -1}
          isPickedTeam={pickedTeam === awayTeam}
          hasStarted={timestamp < Date.now()}
          score={awayScore}
          result={result}
          onPickTeam={onPickTeam}
        />
        <p className={classes.at}>at</p>
        <ScMakePicksTeam
          gameId={gameId}
          teamName={homeTeam}
          spread={homeSpread}
          isPickedTeam={pickedTeam === homeTeam}
          hasStarted={timestamp < Date.now()}
          score={homeScore}
          result={result}
          onPickTeam={onPickTeam}
        />
      </div>
    </Paper>
  );
};
