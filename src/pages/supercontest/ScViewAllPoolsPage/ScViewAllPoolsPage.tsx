import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { useScGetAllPools } from "../../../hooks/supercontest/useScGetAllPools";
import { useScGetUserPools } from "../../../hooks/supercontest/useScGetUserPools";
import { AuthContext } from "../../../store/auth-context";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScViewAllPoolsPage.module.css";

export const ScViewAllPoolsPage = () => {
  const { username: loggedInUsername } = useContext(AuthContext);
  const { data: allPoolsData } = useScGetAllPools();
  const { data: allJoinedPoolsData } = useScGetUserPools(loggedInUsername);

  if (!allPoolsData) {
    return <LoadingSpinner type="primary" />;
  }

  const pools = allPoolsData.map((pool) => {
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
        contest="supercontest"
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
        <title>Chad's | All SC Pools</title>
      </Helmet>
      <div className={classes.allPools}>All Supercontest Pools</div>
      {pools}
    </div>
  );
};
