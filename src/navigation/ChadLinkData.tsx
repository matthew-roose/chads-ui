import {
  IconBallAmericanFootball,
  IconHistory,
  IconUsers,
  IconCurrencyDollar,
  IconCircles,
  IconCirclePlus,
  IconReportAnalytics,
  IconTimeline,
  IconCalendar,
  IconChartBar,
  IconTrophy,
  IconPoo,
  IconMultiplier2x,
  IconHeart,
  IconSword,
  IconWallet,
} from "@tabler/icons";
import { LinkData } from "./ChadNavLinks";

export const getSportsbookLinkData = (
  username: string,
  currentWeekNumber: number
): LinkData[] => [
  {
    icon: <IconCurrencyDollar size={24} color="green" />,
    label: "Sportsbook",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconBallAmericanFootball size={24} color="maroon" />,
        label: "Place Bets",
        to: "/sportsbook/place-bets",
        public: true,
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
          },
          {
            icon: <IconCircles size={24} color="red" />,
            label: "View All Pools",
            to: "/sportsbook/pools",
            public: true,
          },
          {
            icon: <IconCirclePlus size={24} color="green" />,
            label: "Create Pool",
            to: "/sportsbook/create-pool",
            public: true,
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
            public: true,
          },
          {
            icon: <IconCurrencyDollar size={24} color="green" />,
            label: "Public Money",
            to: `/sportsbook/public-money/week/${currentWeekNumber}`,
            public: true,
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
            public: true,
          },
          {
            icon: <IconTrophy size={24} color="gold" />,
            label: "Season Leaderboard",
            to: "/sportsbook/leaderboard/season",
            public: true,
          },
          {
            icon: <IconCurrencyDollar size={24} color="green" />,
            label: "Best Weeks",
            to: "/sportsbook/leaderboard/best-weeks",
            public: true,
          },
          {
            icon: <IconPoo size={24} color="brown" />,
            label: "Worst Weeks",
            to: "/sportsbook/leaderboard/worst-weeks",
            public: true,
          },
          {
            icon: <IconMultiplier2x size={24} color="green" />,
            label: "Best Parlays",
            to: "/sportsbook/leaderboard/best-parlays",
            public: true,
          },
        ],
      },
      {
        icon: <IconWallet size={24} color="green" />,
        label: "Cashier",
        to: "/sportsbook/cashier",
        public: true,
      },
    ],
  },
];

export const getSupercontestLinkData = (
  username: string,
  currentWeekNumber: number
): LinkData[] => [
  {
    icon: <IconTrophy size={24} color="gold" />,
    label: "Supercontest",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconBallAmericanFootball size={24} color="maroon" />,
        label: "Make Picks",
        to: "/supercontest/make-picks",
        public: true,
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
          },
          {
            icon: <IconCircles size={24} color="red" />,
            label: "View All Pools",
            to: "/supercontest/pools",
            public: true,
          },
          {
            icon: <IconCirclePlus size={24} color="green" />,
            label: "Create Pool",
            to: "/supercontest/create-pool",
            public: true,
          },
        ],
      },
      {
        icon: <IconReportAnalytics size={24} color="green" />,
        label: "My Stats",
        to: "",
        public: true,
        childLinks: [
          {
            icon: <IconTimeline size={24} color="blue" />,
            label: "Weekly Performance",
            to: `/supercontest/${username}/stats/weekly`,
          },
          {
            icon: <IconUsers size={24} color="darkorange" />,
            label: "Head To Head Stats",
            to: "/supercontest/h2h-stats",
            public: true,
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
        label: "Public Stats",
        to: "",
        public: true,
        childLinks: [
          {
            icon: <IconUsers size={24} color="green" />,
            label: "Weekly Performance",
            to: "/supercontest/public-picks/record",
            public: true,
          },
          {
            icon: <IconUsers size={24} color="blue" />,
            label: "Most Popular This Week",
            to: `/supercontest/public-picks/week/${currentWeekNumber}`,
            public: true,
          },
          {
            icon: <IconUsers size={24} color="red" />,
            label: "Most Popular This Season",
            to: "/supercontest/public-picks/season",
            public: true,
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
            public: true,
          },
          {
            icon: <IconTrophy size={24} color="gold" />,
            label: "Season Leaderboard",
            to: "/supercontest/leaderboard/season",
            public: true,
          },
        ],
      },
    ],
  },
];

export const getSurvivorLinkData = (
  username: string,
  currentWeekNumber: number
): LinkData[] => [
  {
    icon: <IconTimeline size={24} color="blue" />,
    label: "Survivor",
    to: "",
    public: true,
    childLinks: [
      {
        icon: <IconBallAmericanFootball size={24} color="maroon" />,
        label: "Make Picks",
        to: "/survivor/make-picks",
        public: true,
      },
      {
        icon: <IconHistory size={24} color="darkorange" />,
        label: "Pick History",
        to: `/survivor/pick-history/${username}`,
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
            to: `/survivor/${username}/pools`,
          },
          {
            icon: <IconCircles size={24} color="red" />,
            label: "View All Pools",
            to: "/survivor/pools",
            public: true,
          },
          {
            icon: <IconCirclePlus size={24} color="green" />,
            label: "Create Pool",
            to: "/survivor/create-pool",
            public: true,
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
            icon: <IconUsers size={24} color="blue" />,
            label: "Most Popular This Week",
            to: `/survivor/public-picks/week/${currentWeekNumber}`,
            public: true,
          },
          {
            icon: <IconUsers size={24} color="red" />,
            label: "Most Popular This Season",
            to: "/survivor/public-picks/season",
            public: true,
          },
        ],
      },
      {
        icon: <IconChartBar size={24} color="blue" />,
        label: "Leaderboard",
        to: "/survivor/leaderboard",
        public: true,
      },
    ],
  },
];
