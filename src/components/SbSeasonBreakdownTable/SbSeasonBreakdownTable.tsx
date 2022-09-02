import { Table } from "@mantine/core";
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
  const breakdownRows = rows
    .sort((a, b) => b.amountWagered - a.amountWagered)
    .map((row) => {
      const {
        team,
        total,
        betType,
        amountWagered,
        amountWon,
        amountLost,
        amountProfited,
      } = row;
      const amountProfitedClass =
        amountProfited > 0
          ? classes.positive
          : amountProfited < 0
          ? classes.negative
          : "";
      return (
        <tr
          key={`${team}${total}${betType}`}
          className={classes.leaderboardRow}
        >
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
            {formatCurrency(amountLost * -1, 0)}
          </td>
          <td className={amountProfitedClass}>
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
