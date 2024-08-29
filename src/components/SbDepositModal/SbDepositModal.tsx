import { Button, Image, Modal } from "@mantine/core";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useSbDeposit } from "../../hooks/sportsbook/useSbDeposit";
import { useSbGetUserPools } from "../../hooks/sportsbook/useSbGetUserPools";
import { ChadContext } from "../../store/chad-context";
import { formatCurrency } from "../../util/format";
import classes from "./SbDepositModal.module.css";

interface SbDepositModalProps {
  opened: boolean;
  totalBalance: number;
  availableBalance: number;
  pendingBalance: number;
  onClose: () => void;
}

export const SbDepositModal = ({
  opened,
  totalBalance,
  availableBalance,
  pendingBalance,
  onClose,
}: SbDepositModalProps) => {
  const { googleJwt, username } = useContext(ChadContext);
  const { refetch: refetchUserBalances } = useSbGetUserPools(username);

  const deposit = useSbDeposit();

  return (
    <Modal radius="lg" size={500} opened={opened} onClose={onClose}>
      <div className={classes.title}>Deposit</div>
      <div className={`${classes.balance} ${classes.totalBalance}`}>
        Total balance: {formatCurrency(totalBalance, 2)}
      </div>
      <div className={classes.balance}>
        Available: {formatCurrency(availableBalance, 2)}
      </div>
      <div className={classes.balance}>
        Pending: {formatCurrency(pendingBalance, 2)}
      </div>
      <div className={classes.warningAndDepositButton}>
        {totalBalance >= 1 && (
          <div className={classes.warning}>
            You can only deposit if your balance goes below $1.00.
          </div>
        )}
        <Button
          className={classes.depositButton}
          disabled={totalBalance >= 1}
          onClick={() =>
            toast
              .promise(deposit.mutateAsync({ googleJwt }), {
                pending: "Depositing...",
                success: "Successfully deposited $10,000!",
                error: "Error depositing!",
              })
              .then(() => refetchUserBalances())
              .then(() => onClose())
          }
          variant="gradient"
          gradient={{ from: "teal", to: "blue" }}
        >
          Deposit $10,000
        </Button>
      </div>

      <Image
        className={classes.image}
        radius="lg"
        src={require("../../assets/deposit.jpeg")}
      />
    </Modal>
  );
};
