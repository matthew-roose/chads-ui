import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { useSbGetAllPools } from "../../../hooks/sportsbook/useSbGetAllPools";
import { useSbGetUserPools } from "../../../hooks/sportsbook/useSbGetUserPools";
import { ChadContext } from "../../../store/chad-context";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbViewAllPoolsPage.module.css";

export const SbViewAllPoolsPage = () => {
  const { username: loggedInUsername } = useContext(ChadContext);
  const { data: allPoolsData } = useSbGetAllPools();
  const { data: allJoinedPoolsData } = useSbGetUserPools(loggedInUsername);

  const pools = allPoolsData?.map((pool) => {
    let alreadyJoined = false;
    if (allJoinedPoolsData) {
      alreadyJoined =
        allJoinedPoolsData.pools.find(
          (joinedPool) => joinedPool.poolName === pool.poolName
        ) !== undefined;
    }
    return (
      <PoolCard
        key={pool.poolName}
        contest="sportsbook"
        poolName={pool.poolName}
        creatorUsername={pool.creatorUsername}
        buyIn={pool.buyIn}
        winLossPrizePct={pool.winLossPrizePct}
        bestParlayPrizePct={pool.bestParlayPrizePct}
        joinType={pool.joinType}
        alreadyJoined={alreadyJoined}
      />
    );
  });
  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | All Pools</title>
      </Helmet>
      <div className={classes.allPools}>All Sportsbook Pools</div>
      {!pools && <LoadingSpinner />}
      {pools?.length === 0 && (
        <div className={classes.noPools}>No pools yet.</div>
      )}
      {pools}
    </div>
  );
};
