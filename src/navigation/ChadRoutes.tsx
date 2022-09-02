import { Route } from "react-router-dom";
import { SbBestParlaysPage } from "../pages/sportsbook/SbBestParlaysPage/SbBestParlaysPage";
import { SbWorstWeeksPage } from "../pages/sportsbook/SbWorstWeeksPage/SbWorstWeeksPage";
import { SbBestWeeksPage } from "../pages/sportsbook/SbBestWeeksPage/SbBestWeeksPage";
import { SbCashierPage } from "../pages/sportsbook/SbCashierPage/SbCashierPage";
import { SbCreatePoolPage } from "../pages/sportsbook/SbCreatePoolPage/SbCreatePoolPage";
import { SbViewAllPoolsPage } from "../pages/sportsbook/SbViewAllPoolsPage/SbViewAllPoolsPage";
import { SbViewUserPoolsPage } from "../pages/sportsbook/SbViewUserPoolsPage/SbViewUserPoolsPage";
import { SbPlaceBetsPage } from "../pages/sportsbook/SbPlaceBetsPage/SbPlaceBetsPage";
import { SbSeasonLeaderboardPage } from "../pages/sportsbook/SbSeasonLeaderboardPage/SbSeasonLeaderboardPage";
import { SbWeeklyPublicStatsPage } from "../pages/sportsbook/SbWeeklyPublicStatsPage/SbWeeklyPublicStatsPage";
import { SbUserSeasonBreakdownPage } from "../pages/sportsbook/SbUserSeasonBreakdownPage/SbUserSeasonBreakdownPage";
import { SbViewBetsPage } from "../pages/sportsbook/SbViewBetsPage/SbViewBetsPage";
import { SbWeeklyLeaderboardPage } from "../pages/sportsbook/SbWeeklyLeaderboardPage/SbWeeklyLeaderboardPage";
import { SbWeeklyPublicMoneyPage } from "../pages/sportsbook/SbWeeklyPublicMoneyPage/SbWeeklyPublicMoneyPage";
import { SbWeeklyUserStatsPage } from "../pages/sportsbook/SbWeeklyUserStatsPage/SbWeeklyUserStatsPage";
import { ScCreatePoolPage } from "../pages/supercontest/ScCreatePoolPage/ScCreatePoolPage";
import { ScViewAllPoolsPage } from "../pages/supercontest/ScViewAllPoolsPage/ScViewAllPoolsPage";
import { ScMakePicksPage } from "../pages/supercontest/ScMakePicksPage/ScMakePicksPage";
import { ScMostFadedTeamsPage } from "../pages/supercontest/ScMostFadedTeamsPage/ScMostFadedTeamsPage";
import { ScMostPickedTeamsPage } from "../pages/supercontest/ScMostPickedTeamsPage/ScMostPickedTeamsPage";
import { ScMostPopularThisSeasonPage } from "../pages/supercontest/ScMostPopularThisSeasonPage/ScMostPopularThisSeasonPage";
import { ScMostPopularThisWeekPage } from "../pages/supercontest/ScMostPopularThisWeekPage/ScMostPopularThisWeekPage";
import { ScViewUserPoolsPage } from "../pages/supercontest/ScViewUserPoolsPage/ScViewUserPoolsPage";
import { ScSeasonLeaderboardPage } from "../pages/supercontest/ScSeasonLeaderboardPage/ScSeasonLeaderboardPage";
import { ScViewPicksPage } from "../pages/supercontest/ScViewPicksPage/ScViewPicksPage";
import { ScWeeklyLeaderboardPage } from "../pages/supercontest/ScWeeklyLeaderboardPage/ScWeeklyLeaderboardPage";
import { ScWeeklyUserStatsPage } from "../pages/supercontest/ScWeeklyUserStatsPage/ScWeeklyUserStatsPage";
import { ScPoolDetailPage } from "../pages/supercontest/ScPoolDetailPage/ScPoolDetailPage";
import { SbPoolDetailPage } from "../pages/sportsbook/SbPoolDetailPage/SbPoolDetailPage";

export const sportsbookRoutes = [
  <Route
    path="/sportsbook/place-bets"
    key="sb-place-bets"
    element={<SbPlaceBetsPage />}
  />,
  <Route
    path="/sportsbook/bet-history/:username/week/:weekNumber"
    key="sb-bet-history"
    element={<SbViewBetsPage />}
  />,
  <Route
    path="/sportsbook/:username/pools"
    key="sb-my-pools"
    element={<SbViewUserPoolsPage />}
  />,
  <Route
    path="/sportsbook/pools"
    key="sb-view-all-pools"
    element={<SbViewAllPoolsPage />}
  />,
  <Route
    path="/sportsbook/create-pool"
    key="sb-create-pool"
    element={<SbCreatePoolPage />}
  />,
  <Route
    path="/sportsbook/pool/:poolName"
    key="sb-pool-detail"
    element={<SbPoolDetailPage />}
  />,
  <Route
    path="/sportsbook/:username/stats/weekly"
    key="sb-weekly-stats"
    element={<SbWeeklyUserStatsPage />}
  />,
  <Route
    path="/sportsbook/:username/stats/season"
    key="sb-season-stats"
    element={<SbUserSeasonBreakdownPage />}
  />,
  <Route
    path="/sportsbook/public-stats/weekly"
    key="sb-public-stats"
    element={<SbWeeklyPublicStatsPage />}
  />,
  <Route
    path="/sportsbook/public-money/week/:weekNumber"
    key="sb-public-money"
    element={<SbWeeklyPublicMoneyPage />}
  />,
  <Route
    path="/sportsbook/leaderboard/week/:weekNumber"
    key="sb-weekly-leaderboard"
    element={<SbWeeklyLeaderboardPage />}
  />,
  <Route
    path="/sportsbook/leaderboard/season"
    key="sb-season-leaderboard"
    element={<SbSeasonLeaderboardPage />}
  />,
  <Route
    path="/sportsbook/leaderboard/best-weeks"
    key="sb-best-weeks"
    element={<SbBestWeeksPage />}
  />,
  <Route
    path="/sportsbook/leaderboard/worst-weeks"
    key="sb-worst-weeks"
    element={<SbWorstWeeksPage />}
  />,
  <Route
    path="/sportsbook/leaderboard/best-parlays"
    key="sb-best-parlays"
    element={<SbBestParlaysPage />}
  />,
  <Route
    path="/sportsbook/cashier"
    key="sb-cashier"
    element={<SbCashierPage />}
  />,
];

export const supercontestRoutes = [
  <Route
    path="/supercontest/make-picks"
    key="sc-make-picks"
    element={<ScMakePicksPage />}
  />,
  <Route
    path="/supercontest/pick-history/:username/week/:weekNumber"
    key="sc-pick-history"
    element={<ScViewPicksPage />}
  />,
  <Route
    path="/supercontest/:username/pools"
    key="sc-my-pools"
    element={<ScViewUserPoolsPage />}
  />,
  <Route
    path="/supercontest/pools"
    key="sc-view-all-pools"
    element={<ScViewAllPoolsPage />}
  />,
  <Route
    path="/supercontest/create-pool"
    key="sc-create-pool"
    element={<ScCreatePoolPage />}
  />,
  <Route
    path="/supercontest/pool/:poolName"
    key="sc-pool-detail"
    element={<ScPoolDetailPage />}
  />,
  <Route
    path="/supercontest/:username/stats/weekly"
    key="sc-weekly-stats"
    element={<ScWeeklyUserStatsPage />}
  />,
  <Route
    path="/supercontest/:username/stats/most-picked"
    key="sc-most-picked"
    element={<ScMostPickedTeamsPage />}
  />,
  <Route
    path="/supercontest/:username/stats/most-faded"
    key="sc-most-faded"
    element={<ScMostFadedTeamsPage />}
  />,
  <Route
    path="/supercontest/public-picks/week/:weekNumber"
    key="sc-public-weekly"
    element={<ScMostPopularThisWeekPage />}
  />,
  <Route
    path="/supercontest/public-picks/season"
    key="sc-public-season"
    element={<ScMostPopularThisSeasonPage />}
  />,
  <Route
    path="/supercontest/leaderboard/week/:weekNumber"
    key="sc-weekly-leaderboard"
    element={<ScWeeklyLeaderboardPage />}
  />,
  <Route
    path="/supercontest/leaderboard/season"
    key="sc-season-leaderboard"
    element={<ScSeasonLeaderboardPage />}
  />,
];
