import { useContext } from "react";
import { Table } from "@mantine/core";
import { ChadContext } from "../../store/chad-context";
import { formatCurrency, formatEnum } from "../../util/format";
import classes from "./SbSeasonBreakdownTable.module.css";

interface SbSeasonBreakdownRow {
  team?: string;
  total?: string;
  betType?: string;
  // only one of the above will be in each row/table
  amountWagered: number;
  amountWon: number;
  amountLost: number;
  amountProfited: number;
}

interface SbSeasonBreakdownTableProps {
  caption: string;
  firstColumnName: string;
  rows: SbSeasonBreakdownRow[];
}

export const SbSeasonBreakdownTable = ({
  caption,
  firstColumnName,
  rows,
}: SbSeasonBreakdownTableProps) => {
  const { useDarkMode } = useContext(ChadContext);
  const breakdownRows = rows.map((row) => {
    const {
      team,
      total,
      betType,
      amountWagered,
      amountWon,
      amountLost,
      amountProfited,
    } = row;
    const amountProfitedClasses = `${
      amountProfited > 0
        ? classes.positive
        : amountProfited < 0
        ? classes.negative
        : ""
    } ${useDarkMode ? classes.darkMode : ""}`;
    return (
      <tr key={`${team}${total}${betType}`} className={classes.leaderboardRow}>
        <td>
          {team && (
            <img
              className={classes.logo}
              src={require(`../../assets/${team.toLowerCase()}.png`)}
              alt={team}
            />
          )}
          {total && formatEnum(total.split("_")[0])}
          {betType && formatEnum(betType)}
        </td>
        <td>{formatCurrency(amountWagered, 0)}</td>
        <td className={classes.hideForMobile}>
          {formatCurrency(amountWon, 0)}
        </td>
        <td className={classes.hideForMobile}>
          {amountLost > 0 ? formatCurrency(amountLost * -1, 0) : "$0"}
        </td>
        <td className={amountProfitedClasses}>
          {formatCurrency(amountProfited, 0)}
        </td>
      </tr>
    );
  });

  return (
    <Table striped highlightOnHover className={classes.table}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th>{firstColumnName}</th>
          <th>Wagered</th>
          <th className={classes.hideForMobile}>Won</th>
          <th className={classes.hideForMobile}>Lost</th>
          <th>Profit</th>
        </tr>
      </thead>
      <tbody>{breakdownRows}</tbody>
    </Table>
  );
};
