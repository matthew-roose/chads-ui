import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Button, PasswordInput, Divider, Select } from "@mantine/core";
import { useSbGetPoolDetail } from "../../../hooks/sportsbook/useSbGetPoolDetail";
import { useSbGetWeeklyLeaderboard } from "../../../hooks/sportsbook/useSbGetWeeklyLeaderboard";
import { useSbJoinPool } from "../../../hooks/sportsbook/useSbJoinPool";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { AuthContext } from "../../../store/auth-context";
import { formatEnum, formatCurrency } from "../../../util/format";
import classes from "./SbPoolDetailPage.module.css";
import { SbWeeklyLeaderboard } from "../../../components/SbWeeklyLeaderboard/SbWeeklyLeaderboard";
import { SbSeasonLeaderboard } from "../../../components/SbSeasonLeaderboard/SbSeasonLeaderboard";

export const SbPoolDetailPage = () => {
  const {
    googleJwt,
    isLoggedIn,
    username: loggedInUsername,
  } = useContext(AuthContext);
  const { poolName } = useParams();
  const [viewingWeek, setViewingWeek] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  const { data: poolDetailData, refetch: refetchPoolDetailData } =
    useSbGetPoolDetail(poolName);
  const { data: weeklyLeaderboardData } = useSbGetWeeklyLeaderboard(
    viewingWeek ? +viewingWeek : currentWeekNumber
  );
  const { mutateAsync: joinPool } = useSbJoinPool(
    googleJwt,
    poolName,
    passwordValue
  );

  if (
    !poolName ||
    !currentWeekNumber ||
    !poolDetailData ||
    !weeklyLeaderboardData
  ) {
    return null;
  }

  if (!viewingWeek) {
    setViewingWeek(currentWeekNumber.toString());
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  if (!viewingWeek) {
    return null;
  }

  const {
    creatorUsername,
    buyIn,
    winLossPrizePct,
    bestParlayPrizePct,
    joinType,
    accounts,
  } = poolDetailData;
  const purse = buyIn * accounts.length;
  const winLossPurse = (winLossPrizePct / 100) * purse;
  const bestParlayPurse = (bestParlayPrizePct / 100) * purse;

  const seasonHasStarted = Date.now() > 1662682800000;
  const alreadyInPool = accounts.find(
    (account) => account.username === loggedInUsername
  );
  const seasonLeadersRows = accounts.sort(
    (a, b) => b.winLossTotal - a.winLossTotal
  );
  const allMembers = accounts.map((account) => account.username);
  const weeklyLeadersRows = weeklyLeaderboardData.filter((userWeek) =>
    allMembers.includes(userWeek.username)
  );

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SB Pool | {poolName}</title>
      </Helmet>
      <div className={classes.poolName}>SB Pool: {poolName}</div>
      <div className={classes.creator}>Created by {creatorUsername}</div>
      <div className={classes.joinType}>{formatEnum(joinType)}</div>
      <div className={classes.buyInAndPurse}>
        {buyIn > 0 ? `$${buyIn} ($${purse} total)` : "FREE"}
      </div>
      {buyIn > 0 && winLossPrizePct > 0 && (
        <div className={classes.prizePct}>
          {`${winLossPrizePct}% for best win/loss (${
            winLossPurse % 1 === 0
              ? `$${winLossPurse}`
              : formatCurrency(winLossPurse, 2)
          })`}
        </div>
      )}
      {buyIn > 0 && bestParlayPrizePct > 0 && (
        <div className={classes.prizePct}>
          {`${bestParlayPrizePct}% for best parlay (${
            bestParlayPurse % 1 === 0
              ? `$${bestParlayPurse}`
              : formatCurrency(bestParlayPurse, 2)
          })`}
        </div>
      )}
      <div>{}</div>
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
              .promise(joinPool(), {
                pending: "Joining this pool...",
                success: "Successfully joined this pool!",
                error: "Error joining this pool!",
              })
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
            onChange={(event) => setPasswordValue(event.currentTarget.value)}
            className={classes.password}
            styles={() => ({
              label: { fontSize: "16px" },
              innerInput: { fontSize: "16px" },
            })}
          />
        )}
      <Divider className={classes.divider} />
      <div className={classes.leaderboardTitle}>Season Leaders</div>
      <SbSeasonLeaderboard rows={seasonLeadersRows} />
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
          itemsWrapper: { padding: "4px", width: "calc(100% - 8px)" },
        })}
      />
      <div className={classes.leaderboardTitle}>Week {viewingWeek} Leaders</div>
      <SbWeeklyLeaderboard
        rows={weeklyLeadersRows}
        showWeekColumn={false}
        showParlayColumn
      />
    </div>
  );
};
