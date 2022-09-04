import { Paper } from "@mantine/core";
import { Link } from "react-router-dom";
import { formatEnum } from "../../util/format";
import classes from "./PoolCard.module.css";

interface PoolCardProps {
  contest: string;
  poolName: string;
  creatorUsername: string;
  buyIn: number;
  winLossPrizePct?: number;
  bestParlayPrizePct?: number;
  joinType: string;
  alreadyJoined?: boolean;
}

export const PoolCard = ({
  contest,
  poolName,
  creatorUsername,
  buyIn,
  winLossPrizePct,
  bestParlayPrizePct,
  joinType,
  alreadyJoined,
}: PoolCardProps) => {
  return (
    <Paper
      radius="lg"
      shadow="lg"
      className={classes.pool}
      component={Link}
      to={`/${contest}/pool/${poolName}`}
    >
      <div>
        <div className={classes.poolName}>{poolName}</div>
        <div className={classes.creator}>Created by: {creatorUsername}</div>
        <div className={classes.joinType}>{formatEnum(joinType)}</div>
        {alreadyJoined && (
          <div className={classes.alreadyJoined}>Already joined this pool!</div>
        )}
      </div>
      <div>
        <div className={classes.buyIn}>{buyIn > 0 ? `$${buyIn}` : "FREE"}</div>
        {buyIn !== 0 && winLossPrizePct !== undefined && (
          <div
            className={classes.prizePct}
          >{`${winLossPrizePct}% Best Win/Loss`}</div>
        )}
        {buyIn !== 0 && bestParlayPrizePct !== undefined && (
          <div
            className={classes.prizePct}
          >{`${bestParlayPrizePct}% Best Parlay`}</div>
        )}
      </div>
    </Paper>
  );
};
