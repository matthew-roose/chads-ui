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

  const isInvalidUsername =
    !username || (allUsernames && !allUsernames.includes(username));

  return (
    <div className={classes.page}>
      <Helmet>
        <title>
          Chad's | Supercontest | {formatUsernamePossessiveForm(username || "")}{" "}
          Pools
        </title>
      </Helmet>
      <UserSelect
        username={username || ""}
        allUsernames={allUsernames || []}
        getNavigateUrl={getNavigateUrl}
      />
      {!isInvalidUsername && (
        <div className={classes.title}>
          {formatUsernamePossessiveForm(username || "")} Supercontest Pools
        </div>
      )}
      {isInvalidUsername && (
        <div className={classes.message}>Invalid username in URL.</div>
      )}
      {!userPoolsData && <LoadingSpinner />}
      {pools}
      {!isInvalidUsername && pools?.length === 0 && (
        <div className={classes.message}>No pools yet.</div>
      )}
    </div>
  );
};
