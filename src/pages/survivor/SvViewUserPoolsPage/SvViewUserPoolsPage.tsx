import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { useSvGetUserPools } from "../../../hooks/survivor/useSvGetUserPools";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { formatUsernamePossessiveForm } from "../../../util/format";
import classes from "./SvViewUserPoolsPage.module.css";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const SvViewUserPoolsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: userPoolsData } = useSvGetUserPools(username);

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
        contest="survivor"
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
    return `/survivor/${username}/pools`;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | {formatUsernamePossessiveForm(username)} SV Pools
        </title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        {formatUsernamePossessiveForm(username)} Survivor Pools
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
