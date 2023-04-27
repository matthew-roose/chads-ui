import classes from "./LoadingSpinner.module.css";

export const LoadingSpinner = () => (
  <div className={classes.positionLoader}>
    <span className={classes.loader}></span>
  </div>
);
