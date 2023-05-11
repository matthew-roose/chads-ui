import { BUY_POINTS_ODDS } from "../../util/constants";
import { SbBetLegType } from "./SbBetLegType";

export interface SbBetLegCreate {
  gameId: number;
  betLegType: SbBetLegType;
  // leave as possibly undefined so SbPlaceBetGame doesn't have to pass null for every type of bet
  boughtPoints?: keyof typeof BUY_POINTS_ODDS | null;
}
