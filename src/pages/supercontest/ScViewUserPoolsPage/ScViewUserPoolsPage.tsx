import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useScGetUserPools } from "../../../hooks/supercontest/useScGetUserPools";
import { formatUsernamePossessiveForm } from "../../../util/format";
import classes from "./ScViewUserPoolsPage.module.css";
import { UserSelect } from "../../../components/UserSelect/UserSelect";

export const ScViewUserPoolsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: userPoolsData } = useScGetUserPools(username);

  if (!allUsernames || !userPoolsData) {
    return null;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div className={classes.message}>Invalid username in URL.</div>;
  }

  const pools = userPoolsData.pools
    .sort((a, b) => a.poolName.localeCompare(b.poolName))
    .map((pool) => (
      <PoolCard
        key={pool.poolName}
        contest="supercontest"
        poolName={pool.poolName}
        creatorUsername={pool.creatorUsername}
        buyIn={pool.buyIn}
        joinType={pool.joinType}
      />
    ));

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/supercontest/${username}/pools`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | {formatUsernamePossessiveForm(username)} SC Pools
        </title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        {formatUsernamePossessiveForm(username)} Supercontest Pools
      </div>
      {pools}
      {pools.length === 0 && (
        <div className={classes.message}>
          {username} hasn't joined any pools yet.
        </div>
      )}
    </div>
  );
};
