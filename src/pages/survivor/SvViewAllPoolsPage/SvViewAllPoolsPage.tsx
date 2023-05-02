import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { useSvGetAllPools } from "../../../hooks/survivor/useSvGetAllPools";
import { useSvGetUserPools } from "../../../hooks/survivor/useSvGetUserPools";
import { ChadContext } from "../../../store/chad-context";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvViewAllPoolsPage.module.css";

export const SvViewAllPoolsPage = () => {
  const { username: loggedInUsername } = useContext(ChadContext);
  const { data: allPoolsData } = useSvGetAllPools();
  const { data: allJoinedPoolsData } = useSvGetUserPools(loggedInUsername);

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
        contest="survivor"
        poolName={pool.poolName}
        creatorUsername={pool.creatorUsername}
        buyIn={pool.buyIn}
        joinType={pool.joinType}
        alreadyJoined={alreadyJoined}
      />
    );
  });
  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Survivor | All Pools</title>
      </Helmet>
      <div className={classes.allPools}>All Survivor Pools</div>
      {!allPoolsData && <LoadingSpinner />}
      {pools?.length === 0 && (
        <div className={classes.noPools}>No pools yet.</div>
      )}
      {pools}
    </div>
  );
};
