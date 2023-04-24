import { Paper } from "@mantine/core";
import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { Result } from "../../types/Result";
import { formatTimestamp } from "../../util/format";
import { ScViewPicksMysteryTeam } from "../ScViewPicksMysteryTeam/ScViewPicksMysteryTeam";
import { ScViewPicksTeam } from "../ScViewPicksTeam/ScViewPicksTeam";
import classes from "./ScViewPicksGame.module.css";

interface ScViewPicksGameProps {
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
  if (!timestamp || !pickedTeam || !homeTeam || !awayTeam || !homeSpread) {
    return (
      <Paper radius="xl" shadow="xl">
        <div className={classes.game}>
          <ScViewPicksMysteryTeam />
          <p className={classes.at}>@</p>
          <ScViewPicksMysteryTeam />
        </div>
      </Paper>
    );
  }

  return (
    <Paper radius="xl" shadow="xl">
      <div className={classes.gameTime}>{formatTimestamp(timestamp, true)}</div>
      <div className={classes.game}>
        <ScViewPicksTeam
          teamName={awayTeam}
          spread={homeSpread * -1}
          isPickedTeam={pickedTeam === awayTeam}
          score={awayScore}
          result={result}
        />
        <p className={classes.at}>@</p>
        <ScViewPicksTeam
          teamName={homeTeam}
          spread={homeSpread}
          isPickedTeam={pickedTeam === homeTeam}
          score={homeScore}
          result={result}
        />
      </div>
    </Paper>
  );
};
