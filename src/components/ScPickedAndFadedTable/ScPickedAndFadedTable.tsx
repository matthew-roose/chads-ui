import { Table } from "@mantine/core";
import { AllTeamLogos } from "../../assets/AllTeamLogos";
import { calculateWinPct, formatRecord } from "../../util/format";
import classes from "./ScPickedAndFadedTable.module.css";

interface ScPickedAndFadedRow {
  team: keyof typeof AllTeamLogos;
  total: number;
  wins: number;
  losses: number;
  pushes: number;
}

interface ScPickedAndFadedTableProps {
  rows: ScPickedAndFadedRow[];
}

export const ScPickedAndFadedTable = ({ rows }: ScPickedAndFadedTableProps) => {
  const teamRows = rows.map((row) => {
    const { team, total, wins, losses, pushes } = row;
    const winPct = calculateWinPct(wins, losses, pushes);
    const recordClass =
      wins - losses > 0
        ? classes.positive
        : wins - losses < 0
        ? classes.negative
        : "";
    return (
      <tr key={team} className={classes.row}>
        <td>
          <img
            className={classes.logo}
            src={AllTeamLogos[team] as unknown as string}
            alt={team}
          />
        </td>
        <td>{total}</td>
        <td className={recordClass}>{formatRecord(wins, losses, pushes)}</td>
        <td className={recordClass}>{winPct ? `${winPct}%` : "N/A"}</td>
      </tr>
    );
  });
  return (
    <Table striped highlightOnHover className={classes.table}>
      <thead>
        <tr>
          <th>Team</th>
          <th>Count</th>
          <th>Record</th>
          <th>Win pct.</th>
        </tr>
      </thead>
      <tbody>{teamRows}</tbody>
    </Table>
  );
};
