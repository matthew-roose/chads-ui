import classes from "./LoadingSpinner.module.css";

export const LoadingSpinner = () => (
  <div className={classes.loaderDiv}>
    <span className={classes.loader}></span>
  </div>
);
