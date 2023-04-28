import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button, Image } from "@mantine/core";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { SbCashOutModal } from "../../../components/SbCashOutModal/SbCashOutModal";
import { SbDepositModal } from "../../../components/SbDepositModal/SbDepositModal";
import { useSbGetUserPools } from "../../../hooks/sportsbook/useSbGetUserPools";
import { AuthContext } from "../../../store/auth-context";
import { formatCurrency } from "../../../util/format";
import classes from "./SbCashierPage.module.css";

export const SbCashierPage = () => {
  const { username } = useContext(AuthContext);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [cashOutModalOpen, setCashOutModalOpen] = useState(false);

  const { data: sbAccountData } = useSbGetUserPools(username);

  if (!username) {
    return (
      <div className={classes.notSignedIn}>
        Please sign in to use the cashier.
      </div>
    );
  }

  if (!sbAccountData) {
    return <LoadingSpinner type="primary" />;
  }

  const { availableBalance, pendingBalance } = sbAccountData;
  const totalBalance = availableBalance + pendingBalance;
  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Cashier</title>
      </Helmet>
      <div className={classes.title}>Cashier</div>
      <div className={`${classes.balance} ${classes.totalBalance}`}>
        Total balance: {formatCurrency(totalBalance, 2)}
      </div>
      <div className={classes.balance}>
        Available balance: {formatCurrency(availableBalance, 2)}
      </div>
      <div className={classes.balance}>
        Pending balance: {formatCurrency(pendingBalance, 2)}
      </div>
      <div className={classes.buttons}>
        <Button
          onClick={() => setDepositModalOpen(true)}
          variant="gradient"
          gradient={{ from: "orange", to: "red" }}
        >
          Deposit
        </Button>
        <Button
          onClick={() => setCashOutModalOpen(true)}
          variant="gradient"
          gradient={{ from: "teal", to: "lime" }}
        >
          Cash Out
        </Button>
      </div>
      <SbDepositModal
        opened={depositModalOpen}
        totalBalance={totalBalance}
        availableBalance={availableBalance}
        pendingBalance={pendingBalance}
        onClose={() => setDepositModalOpen(false)}
      />
      <SbCashOutModal
        opened={cashOutModalOpen}
        totalBalance={totalBalance}
        availableBalance={availableBalance}
        pendingBalance={pendingBalance}
        onClose={() => setCashOutModalOpen(false)}
      />
      <Image
        className={classes.image}
        radius="lg"
        src={require("../../../assets/window.jpeg")}
        alt="Window"
      />
    </div>
  );
};
