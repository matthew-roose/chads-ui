import { useNavigate } from "react-router-dom";
import { Select } from "@mantine/core";
import classes from "./WeekSelect.module.css";

interface WeekSelectProps {
  weekNumber: string;
  allWeekNumbers: string[];
  getNavigateUrl: (weekNumber: string | null) => string;
}

export const WeekSelect = ({
  weekNumber,
  allWeekNumbers,
  getNavigateUrl,
}: WeekSelectProps) => {
  const navigate = useNavigate();
  return (
    <Select
      className={classes.dropdown}
      label="Week"
      value={weekNumber}
      onChange={(newWeekNumber) => navigate(getNavigateUrl(newWeekNumber))}
      data={allWeekNumbers}
      styles={() => ({
        label: { fontSize: "16px" },
        input: { fontSize: "16px" },
        itemsWrapper: { padding: "4px", width: "calc(100% - 8px)" },
      })}
    />
  );
};
