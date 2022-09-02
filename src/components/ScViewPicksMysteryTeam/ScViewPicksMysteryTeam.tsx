import classes from "./ScViewPicksMysteryTeam.module.css";

export const ScViewPicksMysteryTeam = () => {
  return (
    <div className={classes.choice}>
      <div className={classes.mystery}>
        <img
          src={require("../../assets/mystery_team.png")}
          alt="Mystery Team"
        />
      </div>
      <p className={classes.mysteryText}>Game hasn't started</p>
    </div>
  );
};
