import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { useSbGetUserPools } from "../../../hooks/sportsbook/useSbGetUserPools";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { formatUsernamePossessiveForm } from "../../../util/format";
import classes from "./SbViewUserPoolsPage.module.css";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const SbViewUserPoolsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: userPoolsData } = useSbGetUserPools(username);

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
        contest="sportsbook"
        poolName={pool.poolName}
        creatorUsername={pool.creatorUsername}
        buyIn={pool.buyIn}
        winLossPrizePct={pool.winLossPrizePct}
        bestParlayPrizePct={pool.bestParlayPrizePct}
        joinType={pool.joinType}
      />
    ));

  const getNavigateUrl = (username: string | null) => {
    if (!username) {
      return "/";
    }
    return `/sportsbook/${username}/pools`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | {formatUsernamePossessiveForm(username)} SB Pools
        </title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        {formatUsernamePossessiveForm(username)} Sportsbook Pools
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
