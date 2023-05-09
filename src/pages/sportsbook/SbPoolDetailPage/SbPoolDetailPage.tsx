import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Button, PasswordInput, Divider, Select } from "@mantine/core";
import { useSbGetPoolDetail } from "../../../hooks/sportsbook/useSbGetPoolDetail";
import { useSbGetWeeklyLeaderboard } from "../../../hooks/sportsbook/useSbGetWeeklyLeaderboard";
import { useSbJoinPool } from "../../../hooks/sportsbook/useSbJoinPool";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { ChadContext } from "../../../store/chad-context";
import { formatEnum, formatCurrency } from "../../../util/format";
import { SbWeeklyLeaderboard } from "../../../components/SbWeeklyLeaderboard/SbWeeklyLeaderboard";
import { SbSeasonLeaderboard } from "../../../components/SbSeasonLeaderboard/SbSeasonLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import classes from "./SbPoolDetailPage.module.css";

export const SbPoolDetailPage = () => {
  const {
    googleJwt,
    isLoggedIn,
    username: loggedInUsername,
    useDarkMode,
  } = useContext(ChadContext);
  const { poolName } = useParams();
  const [viewingWeek, setViewingWeek] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const {
    data: poolDetailData,
    refetch: refetchPoolDetailData,
    isError: isPoolDetailError,
  } = useSbGetPoolDetail(poolName);
  const { data: weeklyLeaderboardData } = useSbGetWeeklyLeaderboard(
    viewingWeek ? +viewingWeek : currentWeekNumber
  );

  const joinPool = useSbJoinPool();

  useEffect(() => {
    if (!viewingWeek) {
      setViewingWeek(currentWeekNumber?.toString() || "");
    }
  }, [currentWeekNumber, viewingWeek]);

  const allWeekNumbers = Array.from(
    { length: currentWeekNumber || 0 },
    (_, i) => (i + 1).toString()
  );

  const creatorUsername = poolDetailData?.creatorUsername || "";
  const buyIn = poolDetailData?.buyIn || 0;
  const winLossPrizePct = poolDetailData?.winLossPrizePct || 0;
  const bestParlayPrizePct = poolDetailData?.bestParlayPrizePct || 0;
  const joinType = poolDetailData?.joinType || "";
  const accounts = poolDetailData?.accounts || [];

  const purse = buyIn * accounts.length;
  const winLossPurse = (winLossPrizePct / 100) * purse;
  const bestParlayPurse = (bestParlayPrizePct / 100) * purse;

  const seasonHasStarted = Date.now() > 1707780600000;
  const alreadyInPool = accounts.find(
    (account) => account.username === loggedInUsername
  );
  const seasonLeaderboardRows = accounts.sort(
    (a, b) => b.winLossTotal - a.winLossTotal
  );
  const allMembers = accounts.map((account) => account.username);
  const weeklyLeaderboardRows = weeklyLeaderboardData?.filter((userWeek) =>
    allMembers.includes(userWeek.username)
  );

  const isDataLoading =
    !currentWeekNumber ||
    !poolDetailData ||
    allWeekNumbers.length === 0 ||
    !seasonLeaderboardRows;

  const buyInAndPurseClasses = `${classes.buyInAndPurse} ${
    useDarkMode ? classes.darkMode : ""
  }`;

  const prizePctClasses = `${classes.prizePct} ${
    useDarkMode ? classes.darkMode : ""
  }`;

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Sportsbook | Pool | {poolName}</title>
      </Helmet>
      <div className={classes.poolName}>Sportsbook Pool: {poolName}</div>
      {isDataLoading && !isPoolDetailError && <LoadingSpinner />}
      {isPoolDetailError && (
        <div className={classes.message}>
          There was a problem fetching data for this pool.
        </div>
      )}
      {!isDataLoading && (
        <>
          <div className={classes.creator}>Created by {creatorUsername}</div>
          <div className={classes.joinType}>{formatEnum(joinType)}</div>
          <div className={buyInAndPurseClasses}>
            {buyIn > 0 ? `$${buyIn} ($${purse} total)` : "FREE"}
          </div>
          {buyIn > 0 && winLossPrizePct > 0 && (
            <div className={prizePctClasses}>
              {`${winLossPrizePct}% for best win/loss (${
                winLossPurse % 1 === 0
                  ? `$${winLossPurse}`
                  : formatCurrency(winLossPurse, 2)
              })`}
            </div>
          )}
          {buyIn > 0 && bestParlayPrizePct > 0 && (
            <div className={prizePctClasses}>
              {`${bestParlayPrizePct}% for best parlay (${
                bestParlayPurse % 1 === 0
                  ? `$${bestParlayPurse}`
                  : formatCurrency(bestParlayPurse, 2)
              })`}
            </div>
          )}
          {isLoggedIn && !seasonHasStarted && !alreadyInPool && (
            <Button
              disabled={joinType === "PRIVATE" && passwordValue === ""}
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
          {joinType === "PRIVATE" &&
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
          <div className={classes.leaderboardTitle}>Season Leaderboard</div>
          <SbSeasonLeaderboard rows={seasonLeaderboardRows} />
          <Divider className={classes.divider} />
          <Select
            className={classes.dropdown}
            label="Week"
            value={viewingWeek}
            onChange={(newWeek) => setViewingWeek(newWeek || "")}
            data={allWeekNumbers}
            styles={() => ({
              label: { fontSize: "16px" },
              input: { fontSize: "16px" },
            })}
          />
          <div className={classes.leaderboardTitle}>
            Week {viewingWeek} Leaderboard
          </div>
          {!weeklyLeaderboardData && <LoadingSpinner />}
          {weeklyLeaderboardRows?.length === 0 && (
            <div className={classes.message}>No stats yet.</div>
          )}
          {weeklyLeaderboardRows && weeklyLeaderboardRows.length > 0 && (
            <SbWeeklyLeaderboard
              rows={weeklyLeaderboardRows}
              showWeekColumn={false}
              showParlayColumn
            />
          )}
        </>
      )}
    </div>
  );
};
