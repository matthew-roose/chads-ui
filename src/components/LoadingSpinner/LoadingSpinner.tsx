import { useContext } from "react";
import classes from "./LoadingSpinner.module.css";
import { ChadContext } from "../../store/chad-context";

export const LoadingSpinner = () => {
  const { useDarkMode } = useContext(ChadContext);
  const loaderClasses = `${classes.loader} ${
    useDarkMode ? classes.darkMode : classes.lightMode
  }`;
  return (
    <div className={classes.loaderDiv}>
      <span className={loaderClasses}></span>
    </div>
  );
};
