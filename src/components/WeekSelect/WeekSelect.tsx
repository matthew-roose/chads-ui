import { Select } from "@mantine/core";
import { useNavigate } from "react-router-dom";
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
        itemsWrapper: { padding: "4px", width: "calc(100% - 8px)" },
      })}
    />
  );
};
