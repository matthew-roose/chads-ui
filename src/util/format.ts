export const formatTeamName = (teamName: string) =>
  teamName.replaceAll("_", " ");

export const formatTeamMascot = (teamName: string) => teamName.split("_").pop();

export const formatTimestamp = (timestamp: number, showWeekday: boolean) =>
  new Date(timestamp).toLocaleTimeString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: showWeekday ? "short" : undefined,
    hour: "numeric",
    minute: "2-digit",
  });

export const formatEnum = (enumValue: string) =>
  `${enumValue.slice(0, 1)}${enumValue.slice(1).toLocaleLowerCase()}`;

export const formatUsernamePossessiveForm = (username: string) =>
  `${username}'${username.slice(-1) === "s" ? "" : "s"}`;

export const formatRecord = (wins: number, losses: number, pushes: number) =>
  `${wins}-${losses}${pushes > 0 ? `-${pushes}` : ""}`;

export const calculateWinPct = (wins: number, losses: number, pushes: number) =>
  wins + losses > 0 ? `${((wins * 100) / (wins + losses)).toFixed(1)}` : null;

export const formatSpread = (spread: number) => {
  if (spread < 0) {
    return `${spread.toFixed(1)}`;
  }
  if (spread > 0) {
    return `+${spread.toFixed(1)}`;
  }
  return "PK";
};

export const formatCurrency = (amount: number, places: number) => {
  if (amount < 0) {
    return `-$${(amount * -1).toLocaleString("en-US", {
      minimumFractionDigits: places,
      maximumFractionDigits: places,
    })}`;
  }
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  })}`;
};

export const convertOddsFromDecimal = (decimalOdds: number) => {
  if (decimalOdds === 1.0) {
    return "";
  }
  let americanOdds;
  if (decimalOdds >= 2.0) {
    americanOdds = (decimalOdds - 1) * 100;
  } else {
    americanOdds = -100 / (decimalOdds - 1);
  }
  if (americanOdds > 100) {
    return `+${americanOdds.toFixed(0)}`;
  } else if (americanOdds < -100) {
    return americanOdds.toFixed(0);
  }
  return "EVEN";
};
