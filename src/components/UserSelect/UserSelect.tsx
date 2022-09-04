import { useNavigate } from "react-router-dom";

import { Select } from "@mantine/core";
import classes from "./UserSelect.module.css";

interface UserSelectProps {
  username: string;
  allUsernames: string[];
  getNavigateUrl: (username: string | null) => string;
}

export const UserSelect = ({
  username,
  allUsernames,
  getNavigateUrl,
}: UserSelectProps) => {
  const navigate = useNavigate();
  return (
    <form spellCheck={false} className={classes.dropdown}>
      <Select
        label="User"
        value={username}
        onChange={(newUsername) => navigate(getNavigateUrl(newUsername))}
        data={allUsernames}
        searchable
        nothingFound="No users found"
        styles={() => ({
          label: { fontSize: "16px" },
          input: { fontSize: "16px" },
          itemsWrapper: { padding: "4px", width: "calc(100% - 8px)" },
        })}
      />
    </form>
  );
};
