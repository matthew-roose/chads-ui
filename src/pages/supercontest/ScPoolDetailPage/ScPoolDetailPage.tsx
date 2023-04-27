import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button, Divider, PasswordInput, Select } from "@mantine/core";
import { useGetCurrentWeekNumber } from "../../../hooks/useGetCurrentWeekNumber";
import { useScGetPoolDetail } from "../../../hooks/supercontest/useScGetPoolDetail";
import { useScJoinPool } from "../../../hooks/supercontest/useScJoinPool";
import { AuthContext } from "../../../store/auth-context";
import { formatEnum } from "../../../util/format";
import classes from "./ScPoolDetailPage.module.css";
import { toast } from "react-toastify";
import { ScLeaderboard } from "../../../components/ScLeaderboard/ScLeaderboard";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const ScPoolDetailPage = () => {
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
    useScGetPoolDetail(poolName);

  const joinPool = useScJoinPool();

  if (!currentWeekNumber || !poolDetailData) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (!viewingWeek) {
    setViewingWeek(currentWeekNumber.toString());
  }

  const allWeekNumbers = Array.from({ length: currentWeekNumber }, (_, i) =>
    (i + 1).toString()
  );

  const seasonHasStarted = Date.now() > 1707780600000;
  const alreadyInPool = poolDetailData.entries.find(
    (entry) => entry.username === loggedInUsername
  );

  const seasonLeaderboardRows = poolDetailData.entries
    .sort((a, b) => a.username.localeCompare(b.username))
    .sort((a, b) => a.seasonLosses - b.seasonLosses)
    .sort((a, b) => b.seasonScore - a.seasonScore)
    .map((entry) => {
      const { username, seasonScore, seasonWins, seasonLosses, seasonPushes } =
        entry;
      return {
        username,
        score: seasonScore,
        wins: seasonWins,
        losses: seasonLosses,
        pushes: seasonPushes,
      };
    });

  const weeklyLeaderboardRows = poolDetailData.entries
    .sort((a, b) => a.username.localeCompare(b.username))
    .sort(
      (a, b) =>
        a.supercontestEntryWeeks[+viewingWeek - 1].weekLosses -
        b.supercontestEntryWeeks[+viewingWeek - 1].weekLosses
    )
    .sort(
      (a, b) =>
        b.supercontestEntryWeeks[+viewingWeek - 1].weekScore -
        a.supercontestEntryWeeks[+viewingWeek - 1].weekScore
    )
    .map((entry) => {
      const entryWeek = entry.supercontestEntryWeeks[+viewingWeek - 1];
      const { username, weekScore, weekWins, weekLosses, weekPushes } =
        entryWeek;
      return {
        username,
        score: weekScore,
        wins: weekWins,
        losses: weekLosses,
        pushes: weekPushes,
      };
    });

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | SC Pool | {poolName}</title>
      </Helmet>
      <div className={classes.poolName}>SC Pool: {poolName}</div>
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
            onChange={(event) => setPasswordValue(event.currentTarget.value)}
            className={classes.password}
            styles={() => ({
              label: { fontSize: "16px" },
              innerInput: { fontSize: "16px" },
            })}
          />
        )}

      <Divider className={classes.divider} />

      <div className={classes.leaderboardTitle}>Season Leaderboard</div>
      <ScLeaderboard
        rows={seasonLeaderboardRows}
        linkedWeekNumber={currentWeekNumber}
      />

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
      <div className={classes.leaderboardTitle}>
        Week {viewingWeek} Leaderboard
      </div>
      <ScLeaderboard
        rows={weeklyLeaderboardRows}
        linkedWeekNumber={+viewingWeek}
      />
    </div>
  );
};
