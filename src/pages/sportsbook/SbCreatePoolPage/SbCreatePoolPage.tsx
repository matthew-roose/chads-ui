import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
  TextInput,
  NumberInput,
  Radio,
  PasswordInput,
  Button,
} from "@mantine/core";
import { useSbCreatePool } from "../../../hooks/sportsbook/useSbCreatePool";
import { AuthContext } from "../../../store/auth-context";
import classes from "./SbCreatePoolPage.module.css";

export const SbCreatePoolPage = () => {
  const { isLoggedIn, googleJwt } = useContext(AuthContext);
  const navigate = useNavigate();
  const [poolName, setPoolName] = useState("");
  const [buyIn, setBuyIn] = useState(0);
  const [winLossPrizePct, setWinLossPrizePct] = useState(50);
  const [bestParlayPrizePct, setBestParlayPrizePct] = useState(50);
  const [joinType, setJoinType] = useState("PUBLIC");
  const [password, setPassword] = useState("");

  const createPool = useSbCreatePool();

  if (!isLoggedIn) {
    return (
      <div className={classes.notSignedIn}>
        Please sign in to create a sportsbook pool.
      </div>
    );
  }

  const isPoolInfoComplete =
    poolName.trim().length > 4 &&
    poolName.trim().length <= 20 &&
    (joinType === "PUBLIC" ||
      (password.trim().length > 4 && password.trim().length <= 20));

  const buyInDisplayValue = buyIn !== 0 ? buyIn : undefined;

  return (
    <>
      <Helmet>
        <title>Chad's | Create SB Pool</title>
      </Helmet>
      <div className={classes.title}>Create a Sportsbook Pool</div>
      <div className={classes.form}>
        <form spellCheck={false}>
          <TextInput
            value={poolName}
            label="Pool name"
            description="Pool name should be 5-20 characters."
            placeholder="Pool name"
            onChange={(event) => setPoolName(event.currentTarget.value)}
            styles={() => ({
              label: { fontSize: "16px" },
              input: { fontSize: "16px" },
            })}
          />
        </form>
        <NumberInput
          value={buyInDisplayValue}
          min={0}
          error={buyIn > 100 ? "Max buy-in is $100." : undefined}
          label="Buy in"
          onChange={(value) => setBuyIn(value || 0)}
          styles={() => ({
            label: { fontSize: "16px" },
            input: { fontSize: "16px" },
          })}
        />
        {buyIn > 0 && (
          <NumberInput
            value={winLossPrizePct}
            max={100}
            min={0}
            label="Win/Loss Prize Pct."
            onChange={(value) => {
              setWinLossPrizePct(value || 0);
              setBestParlayPrizePct(value ? 100 - value : 100);
            }}
            styles={() => ({
              label: { fontSize: "16px" },
              input: { fontSize: "16px" },
            })}
          />
        )}
        {buyIn > 0 && (
          <NumberInput
            value={bestParlayPrizePct}
            max={100}
            min={0}
            label="Best Parlay Prize Pct."
            onChange={(value) => {
              setBestParlayPrizePct(value || 0);
              setWinLossPrizePct(value ? 100 - value : 100);
            }}
            styles={() => ({
              label: { fontSize: "16px" },
              input: { fontSize: "16px" },
            })}
          />
        )}
        <Radio.Group
          value={joinType}
          onChange={setJoinType}
          label="Choose access type for your pool"
          styles={() => ({
            label: { fontSize: "16px" },
          })}
        >
          <Radio
            value="PUBLIC"
            label="Public"
            styles={() => ({
              label: { fontSize: "16px" },
            })}
          />
          <Radio
            value="PRIVATE"
            label="Private"
            styles={() => ({
              label: { fontSize: "16px" },
            })}
          />
        </Radio.Group>
        {joinType === "PRIVATE" && (
          <PasswordInput
            value={password}
            label="Password"
            description="Password should be 5-20 characters."
            placeholder="Password"
            onChange={(event) => setPassword(event.currentTarget.value)}
            styles={() => ({
              label: { fontSize: "16px" },
              innerInput: { fontSize: "16px" },
            })}
          />
        )}
        <Button
          className={classes.createButton}
          disabled={!isPoolInfoComplete || buyIn > 100}
          variant="gradient"
          gradient={{ from: "teal", to: "lime" }}
          onClick={() =>
            toast
              .promise(
                createPool.mutateAsync({
                  googleJwt,
                  pool: {
                    poolName: poolName.trim(),
                    buyIn,
                    winLossPrizePct,
                    bestParlayPrizePct,
                    joinType,
                    password: password.trim(),
                  },
                }),
                {
                  pending: "Creating your pool...",
                  success: "Successfully created your pool!",
                  error: "Error creating your pool!",
                }
              )
              .then(() => navigate("/sportsbook/pools"))
          }
        >
          Create Pool
        </Button>
      </div>
    </>
  );
};
