import classes from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  type: "primary" | "secondary";
}

export const LoadingSpinner = ({ type }: LoadingSpinnerProps) => {
  const loaderDivClasses = `${classes.loaderDiv} ${
    type === "primary" ? classes.primaryLoaderDiv : classes.secondaryLoaderDiv
  }`;
  return (
    <div className={loaderDivClasses}>
      <span className={classes.loader}></span>
    </div>
  );
};
