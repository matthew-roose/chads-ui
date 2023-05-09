import { useNavigate } from "react-router-dom";
import { Select } from "@mantine/core";
import classes from "./UserAndWeekSelects.module.css";

interface UserAndWeekSelectsProps {
  username: string;
  allUsernames: string[];
  weekNumber: string;
  allWeekNumbers: string[];
  getNavigateUrl: (
    username: string | null,
    weekNumber: string | null
  ) => string;
}

export const UserAndWeekSelects = ({
  username,
  allUsernames,
  weekNumber,
  allWeekNumbers,
  getNavigateUrl,
}: UserAndWeekSelectsProps) => {
  const navigate = useNavigate();
  return (
    <form spellCheck={false} className={classes.dropdowns}>
      <Select
        label="User"
        value={username}
        onChange={(newUsername) =>
          navigate(getNavigateUrl(newUsername, weekNumber))
        }
        data={allUsernames}
        searchable
        nothingFound="No users found"
        styles={() => ({
          label: { fontSize: "16px" },
          input: { fontSize: "16px" },
        })}
      />
      <Select
        label="Week"
        value={weekNumber}
        onChange={(newWeekNumber) =>
          navigate(getNavigateUrl(username, newWeekNumber))
        }
        data={allWeekNumbers}
        styles={() => ({
          label: { fontSize: "16px" },
          input: { fontSize: "16px" },
        })}
      />
    </form>
  );
};
