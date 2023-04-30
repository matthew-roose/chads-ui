import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { UserSelect } from "../../../components/UserSelect/UserSelect";
import { useSvGetUserPools } from "../../../hooks/survivor/useSvGetUserPools";
import { useGetAllUsernames } from "../../../hooks/useGetAllUsernames";
import { formatUsernamePossessiveForm } from "../../../util/format";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvViewUserPoolsPage.module.css";

export const SvViewUserPoolsPage = () => {
  const { username } = useParams();
  const { data: allUsernames } = useGetAllUsernames();
  const { data: userPoolsData } = useSvGetUserPools(username);

  if (!allUsernames) {
    return <LoadingSpinner />;
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
          Chad's | Survivor | {formatUsernamePossessiveForm(username)} Pools
        </title>
      </Helmet>
      <UserSelect
        username={username}
        allUsernames={allUsernames}
        getNavigateUrl={getNavigateUrl}
      />
      <div className={classes.title}>
        {formatUsernamePossessiveForm(username)} Pools
      </div>
      {!userPoolsData && <LoadingSpinner />}
      {pools !== undefined && pools}
      {pools?.length === 0 && (
        <div className={classes.message}>No pools yet.</div>
      )}
    </div>
  );
};
