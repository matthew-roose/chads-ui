import { Button, Image, Modal, NumberInput } from "@mantine/core";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useSbCashOut } from "../../hooks/sportsbook/useSbCashOut";
import { useSbGetUserPools } from "../../hooks/sportsbook/useSbGetUserPools";
import { AuthContext } from "../../store/auth-context";
import { formatCurrency } from "../../util/format";
import classes from "./SbCashOutModal.module.css";

interface SbCashOutModalProps {
  opened: boolean;
  totalBalance: number;
  availableBalance: number;
  pendingBalance: number;
  onClose: () => void;
}

export const SbCashOutModal = ({
  opened,
  totalBalance,
  availableBalance,
  pendingBalance,
  onClose,
}: SbCashOutModalProps) => {
  const { googleJwt, username } = useContext(AuthContext);
  const [cashOutAmount, setCashOutAmount] = useState(0);
  const { mutateAsync: cashOut } = useSbCashOut(googleJwt, cashOutAmount);
  const { refetch: refetchUserBalances } = useSbGetUserPools(username);

  const cashOutDisplayValue = cashOutAmount !== 0 ? cashOutAmount : undefined;

  const cashOutErrorMessage =
    cashOutAmount > 0 && cashOutAmount < 1
      ? "The minimum cashout is $1."
      : cashOutAmount > 0 && availableBalance === 0
      ? "Your available balance is $0.00."
      : cashOutAmount > availableBalance
      ? `You only have ${formatCurrency(availableBalance, 2)} to cash out.`
      : undefined;

  return (
    <Modal radius="lg" size={500} opened={opened} onClose={onClose}>
      <div className={classes.title}>Cash Out</div>
      <div className={`${classes.balance} ${classes.totalBalance}`}>
        Total balance: ${totalBalance.toFixed(2)}
      </div>
      <div className={classes.balance}>
        Available: ${availableBalance.toFixed(2)}
      </div>
      <div className={classes.balance}>
        Pending: ${pendingBalance.toFixed(2)}
      </div>
      <NumberInput
        className={classes.input}
        min={0}
        value={cashOutDisplayValue}
        error={cashOutErrorMessage}
        label="Cash Out Amount"
        onChange={(value) => setCashOutAmount(value || 0)}
        styles={() => ({
          label: { fontSize: "16px" },
          input: { fontSize: "16px" },
        })}
      />
      <Button
        className={classes.cashOutButton}
        disabled={cashOutAmount < 1 || cashOutAmount > availableBalance}
        onClick={() =>
          toast
            .promise(cashOut(), {
              pending: "Cashing out...",
              success: `Successfully cashed out $${cashOutAmount}!`,
              error: "Error cashing out!",
            })
            .then(() => setCashOutAmount(0))
            .then(() => refetchUserBalances())
            .then(() => onClose())
        }
        variant="gradient"
        gradient={{ from: "teal", to: "blue" }}
      >
        Cash Out
      </Button>
      <Image radius="lg" src={require("../../assets/cash_out.jpeg")} />
    </Modal>
  );
};
