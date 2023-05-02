import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChadContext } from "../../../store/chad-context";
import { useParams } from "react-router-dom";
import { useSvGetPoolDetail } from "../../../hooks/survivor/useSvGetPoolDetail";
import { useSvJoinPool } from "../../../hooks/survivor/useSvJoinPool";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { Button, PasswordInput, Divider } from "@mantine/core";
import { toast } from "react-toastify";
import { SvLeaderboard } from "../../../components/SvLeaderboard/SvLeaderboard";
import { formatEnum } from "../../../util/format";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SvPoolDetailPage.module.css";

export const SvPoolDetailPage = () => {
  const {
    googleJwt,
    isLoggedIn,
    username: loggedInUsername,
  } = useContext(ChadContext);
  const { poolName } = useParams();
  const [passwordValue, setPasswordValue] = useState("");
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const {
    data: poolDetailData,
    refetch: refetchPoolDetailData,
    isError: isPoolDetailError,
  } = useSvGetPoolDetail(googleJwt, poolName);

  const joinPool = useSvJoinPool();

  const seasonHasStarted = Date.now() > 1707780600000;
  const alreadyInPool = poolDetailData?.entries.find(
    (entry) => entry.username === loggedInUsername
  );

  const leaderboardRows = poolDetailData?.entries
    .sort((a, b) => a.username.localeCompare(b.username))
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .sort((a, b) => a.losses - b.losses)
    .sort((a, b) => b.score - a.score);

  const isDataLoading =
    !currentWeekNumber || !poolDetailData || !leaderboardRows;

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Survivor | Pool | {poolName}</title>
      </Helmet>
      <div className={classes.poolName}>Survivor Pool: {poolName}</div>
      {isDataLoading && !isPoolDetailError && <LoadingSpinner />}
      {isPoolDetailError && (
        <div className={classes.message}>
          There was a problem fetching data for this pool.
        </div>
      )}
      {!isDataLoading && (
        <>
          <div className={classes.creator}>
            Created by {poolDetailData.creatorUsername}
          </div>
          <div className={classes.joinType}>
            {formatEnum(poolDetailData.joinType)}
          </div>
          <div className={classes.buyInAndPurse}>
            {poolDetailData.buyIn > 0
              ? `$${poolDetailData.buyIn} ($${
                  poolDetailData.buyIn * poolDetailData.entries.length
                } total)`
              : "FREE"}
          </div>
          {isLoggedIn && !seasonHasStarted && !alreadyInPool && (
            <Button
              disabled={
                poolDetailData.joinType === "PRIVATE" && passwordValue === ""
              }
              variant="gradient"
              gradient={{ from: "teal", to: "lime" }}
              className={classes.joinButton}
              onClick={() =>
                toast
                  .promise(
                    joinPool.mutateAsync({
                      googleJwt,
                      poolName,
                      password: passwordValue,
                    }),
                    {
                      pending: "Joining this pool...",
                      success: "Successfully joined this pool!",
                      error: "Error joining this pool!",
                    }
                  )
                  .then(() => refetchPoolDetailData())
              }
            >
              Join
            </Button>
          )}
          {poolDetailData.joinType === "PRIVATE" &&
            isLoggedIn &&
            !seasonHasStarted &&
            !alreadyInPool && (
              <PasswordInput
                placeholder="Password"
                onChange={(event) =>
                  setPasswordValue(event.currentTarget.value)
                }
                className={classes.password}
                styles={() => ({
                  label: { fontSize: "16px" },
                  innerInput: { fontSize: "16px" },
                })}
              />
            )}
          <Divider className={classes.divider} />
          <div className={classes.leaderboardTitle}>Leaderboard</div>
          <SvLeaderboard
            rows={leaderboardRows}
            currentWeekNumber={currentWeekNumber}
          />
        </>
      )}
    </div>
  );
};
