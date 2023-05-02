import { useContext } from "react";
import { ChadContext } from "../../store/chad-context";
import { Switch, useMantineTheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";
import classes from "./SettingsPage.module.css";

export const SettingsPage = () => {
  const { useDarkMode, toggleDarkMode } = useContext(ChadContext);
  const theme = useMantineTheme();

  return (
    <div className={classes.page}>
      <div className={classes.title}>Settings</div>
      <Switch
        style={{ fontWeight: "bold" }}
        label="Dark Mode"
        color={theme.colorScheme === "dark" ? "gray" : "dark"}
        onLabel={
          <IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />
        }
        offLabel={
          <IconMoonStars
            size="1rem"
            stroke={2.5}
            color={theme.colors.blue[6]}
          />
        }
        size="lg"
        checked={useDarkMode ? true : false}
        onChange={() => toggleDarkMode()}
      />
    </div>
  );
};
