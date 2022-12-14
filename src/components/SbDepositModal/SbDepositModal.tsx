import { Button, Image, Modal } from "@mantine/core";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useSbDeposit } from "../../hooks/sportsbook/useSbDeposit";
import { useSbGetUserPools } from "../../hooks/sportsbook/useSbGetUserPools";
import { AuthContext } from "../../store/auth-context";
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
  const { googleJwt, username } = useContext(AuthContext);
  const { mutateAsync: deposit } = useSbDeposit(googleJwt);
  const { refetch: refetchUserBalances } = useSbGetUserPools(username);

  return (
    <Modal radius="lg" size={500} opened={opened} onClose={onClose}>
      <div className={classes.title}>Deposit</div>
      <div className={`${classes.balance} ${classes.totalBalance}`}>
        Total balance: ${totalBalance.toFixed(2)}
      </div>
      <div className={classes.balance}>
        Available: ${availableBalance.toFixed(2)}
      </div>
      <div className={classes.balance}>
        Pending: ${pendingBalance.toFixed(2)}
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
              .promise(deposit(), {
                pending: "Depositing...",
                success: "Successfully deposited $1000!",
                error: "Error depositing!",
              })
              .then(() => refetchUserBalances())
              .then(() => onClose())
          }
          variant="gradient"
          gradient={{ from: "teal", to: "blue" }}
        >
          Deposit $1000
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
