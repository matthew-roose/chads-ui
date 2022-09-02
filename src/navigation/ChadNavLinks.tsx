import { useContext } from "react";

import { Navbar, Text } from "@mantine/core";

import {
  IconBallAmericanFootball,
  IconHistory,
  IconReportAnalytics,
  IconUsers,
  IconCurrencyDollar,
  IconChartBar,
  IconMultiplier2x,
  IconTrophy,
  IconPoo,
  IconTimeline,
  IconCalendar,
  IconCirclePlus,
  IconCircles,
  IconHeart,
  IconSword,
} from "@tabler/icons";

import { ChadNavLink } from "./ChadNavLink";
import { AuthContext } from "../store/auth-context";
import { useGetCurrentWeekNumber } from "../hooks/useGetCurrentWeekNumber";

interface LinksProps {
  closeNavbar: () => void;
}

interface LinkData {
  icon: React.ReactNode;
  label: string;
  to: string;
  public?: boolean;
  privateChild?: boolean;
  childLinks?: LinkData[];
}

const getSportsbookLinkData = (
  username: string,
  currentWeekNumber: number
): LinkData[] => [
  {
    icon: <IconBallAmericanFootball size={24} color="maroon" />,
    label: "Place Bets",
    to: "/sportsbook/place-bets",
  },
  {
    icon: <IconHistory size={24} color="darkorange" />,
    label: "Bet History",
    to: `/sportsbook/bet-history/${username}/week/${currentWeekNumber}`,
  },
  {
    icon: <IconUsers size={24} color="blue" />,
    label: "Pools",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconCurrencyDollar size={24} color="green" />,
        label: "My Pools",
        to: `/sportsbook/${username}/pools`,
        privateChild: true,
      },
      {
        icon: <IconCircles size={24} color="red" />,
        label: "View All Pools",
        to: "/sportsbook/pools",
      },
      {
        icon: <IconCirclePlus size={24} color="green" />,
        label: "Create Pool",
        to: "/sportsbook/create-pool",
        privateChild: true,
      },
    ],
  },
  {
    icon: <IconReportAnalytics size={24} color="green" />,
    label: "My Stats",
    to: "",
    childLinks: [
      {
        icon: <IconTimeline size={24} color="blue" />,
        label: "Weekly Performance",
        to: `/sportsbook/${username}/stats/weekly`,
      },
      {
        icon: <IconCalendar size={24} color="red" />,
        label: "Season Breakdown",
        to: `/sportsbook/${username}/stats/season`,
      },
    ],
  },
  {
    icon: <IconReportAnalytics size={24} color="darkorange" />,
    label: "Public Stats",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconTimeline size={24} color="blue" />,
        label: "Weekly Performance",
        to: "/sportsbook/public-stats/weekly",
      },
      {
        icon: <IconCurrencyDollar size={24} color="green" />,
        label: "Public Money",
        to: `/sportsbook/public-money/week/${currentWeekNumber}`,
      },
    ],
  },
  {
    icon: <IconChartBar size={24} color="blue" />,
    label: "Leaderboards",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconTimeline size={24} color="blue" />,
        label: "Weekly Leaderboard",
        to: `/sportsbook/leaderboard/week/${currentWeekNumber}`,
      },
      {
        icon: <IconCalendar size={24} color="red" />,
        label: "Season Leaderboard",
        to: "/sportsbook/leaderboard/season",
      },
      {
        icon: <IconTrophy size={24} color="green" />,
        label: "Best Weeks",
        to: "/sportsbook/leaderboard/best-weeks",
      },
      {
        icon: <IconPoo size={24} color="brown" />,
        label: "Worst Weeks",
        to: "/sportsbook/leaderboard/worst-weeks",
      },
      {
        icon: <IconMultiplier2x size={24} color="green" />,
        label: "Best Parlays",
        to: "/sportsbook/leaderboard/best-parlays",
      },
    ],
  },
  {
    icon: <IconCurrencyDollar size={24} color="green" />,
    label: "Cashier",
    to: "/sportsbook/cashier",
  },
];

const SportsbookLinks = ({ closeNavbar }: LinksProps) => {
  const { username } = useContext(AuthContext);
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  let links;
  let chadLinks;
  if (!currentWeekNumber) {
    return null;
  }
  if (!username) {
    // only show links that don't require user to be logged in
    links = getSportsbookLinkData("", currentWeekNumber).filter(
      (link) => link.public
    );
    chadLinks = links.map((link) => {
      if (link.childLinks) {
        link.childLinks = link.childLinks.filter(
          (childLink) => !childLink.privateChild
        );
      }
      return (
        <ChadNavLink {...link} key={link.label} closeNavbar={closeNavbar} />
      );
    });
  } else {
    // can show all links if user is logged in
    links = getSportsbookLinkData(username, currentWeekNumber);
    chadLinks = links.map((link) => (
      <ChadNavLink {...link} key={link.label} closeNavbar={closeNavbar} />
    ));
  }

  return (
    <>
      <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
        Sportsbook
      </Text>
      <Navbar.Section>{chadLinks}</Navbar.Section>
    </>
  );
};

const getSupercontestLinkData = (
  username: string,
  currentWeekNumber: number
): LinkData[] => [
  {
    icon: <IconBallAmericanFootball size={24} color="maroon" />,
    label: "Make Picks",
    to: "/supercontest/make-picks",
  },
  {
    icon: <IconHistory size={24} color="darkorange" />,
    label: "Pick History",
    to: `/supercontest/pick-history/${username}/week/${currentWeekNumber}`,
  },
  {
    icon: <IconUsers size={24} color="blue" />,
    label: "Pools",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconCurrencyDollar size={24} color="green" />,
        label: "My Pools",
        to: `/supercontest/${username}/pools`,
        privateChild: true,
      },
      {
        icon: <IconCircles size={24} color="red" />,
        label: "View All Pools",
        to: "/supercontest/pools",
      },
      {
        icon: <IconCirclePlus size={24} color="green" />,
        label: "Create Pool",
        to: "/supercontest/create-pool",
        privateChild: true,
      },
    ],
  },
  {
    icon: <IconReportAnalytics size={24} color="green" />,
    label: "My Stats",
    to: "",
    childLinks: [
      {
        icon: <IconTimeline size={24} color="blue" />,
        label: "Weekly Performance",
        to: `/supercontest/${username}/stats/weekly`,
      },
      {
        icon: <IconHeart size={24} color="red" />,
        label: "Most Picked Teams",
        to: `/supercontest/${username}/stats/most-picked`,
      },
      {
        icon: <IconSword size={24} color="gray" />,
        label: "Most Faded Teams",
        to: `/supercontest/${username}/stats/most-faded`,
      },
    ],
  },
  {
    icon: <IconReportAnalytics size={24} color="darkorange" />,
    label: "Public Picks",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconTimeline size={24} color="blue" />,
        label: "Most Popular This Week",
        to: `/supercontest/public-picks/week/${currentWeekNumber}`,
      },
      {
        icon: <IconCalendar size={24} color="red" />,
        label: "Most Popular This Season",
        to: "/supercontest/public-picks/season",
      },
    ],
  },
  {
    icon: <IconChartBar size={24} color="blue" />,
    label: "Leaderboards",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconTimeline size={24} color="blue" />,
        label: "Weekly Leaderboard",
        to: `/supercontest/leaderboard/week/${currentWeekNumber}`,
      },
      {
        icon: <IconCalendar size={24} color="red" />,
        label: "Season Leaderboard",
        to: "/supercontest/leaderboard/season",
      },
    ],
  },
];

const SupercontestLinks = ({ closeNavbar }: LinksProps) => {
  const { username } = useContext(AuthContext);
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  let links;
  let chadLinks;
  if (!currentWeekNumber) {
    return null;
  }
  if (!username) {
    // only show links that don't require user to be logged in
    links = getSupercontestLinkData("", currentWeekNumber).filter(
      (link) => link.public
    );
    chadLinks = links.map((link) => {
      if (link.childLinks) {
        link.childLinks = link.childLinks.filter(
          (childLink) => !childLink.privateChild
        );
      }
      return (
        <ChadNavLink {...link} key={link.label} closeNavbar={closeNavbar} />
      );
    });
  } else {
    // can show all links if user is logged in
    links = getSupercontestLinkData(username, currentWeekNumber);
    chadLinks = links.map((link) => (
      <ChadNavLink {...link} key={link.label} closeNavbar={closeNavbar} />
    ));
  }
  return (
    <>
      <Text
        style={{ marginTop: "1rem", fontWeight: "bold", fontStyle: "italic" }}
      >
        Supercontest
      </Text>
      <Navbar.Section>{chadLinks}</Navbar.Section>
    </>
  );
};

export { SportsbookLinks, SupercontestLinks };
