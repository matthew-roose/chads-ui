import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { useScGetUserPools } from "../../../hooks/supercontest/useScGetUserPools";
import { formatUsernamePossessiveForm } from "../../../util/format";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./ScViewUserPoolsPage.module.css";

export const ScViewUserPoolsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: userPoolsData } = useScGetUserPools(username);

  if (!allUsernames) {
    return <LoadingSpinner type="primary" />;
  }

  if (!username || !allUsernames.includes(username)) {
    return <div className={classes.message}>Invalid username in URL.</div>;
  }

  const pools = userPoolsData?.pools
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
          Chad's | Supercontest | {formatUsernamePossessiveForm(username)} Pools
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
      {!userPoolsData && <LoadingSpinner type="secondary" />}
      {pools !== undefined && pools}
      {pools?.length === 0 && (
        <div className={classes.message}>
          {username} hasn't joined any pools yet.
        </div>
      )}
    </div>
  );
};
