import { useContext } from "react";

import { Navbar } from "@mantine/core";

import { ChadNavLink } from "./ChadNavLink";
import { ChadContext } from "../store/chad-context";
import { useGetCurrentWeekNumber } from "../hooks/useGetCurrentWeekNumber";

export interface LinkData {
  icon: React.ReactNode;
  label: string;
  to: string;
  public?: boolean;
  childLinks?: LinkData[];
}

interface LinksProps {
  closeNavbar: () => void;
  getLinkData: (username: string, currentWeekNumber: number) => LinkData[];
}

const filterChildLinks = (link: LinkData) => {
  if (link.childLinks) {
    link.childLinks = link.childLinks.filter((childLink) => childLink.public);
    link.childLinks.forEach((childLink) => {
      filterChildLinks(childLink);
    });
  }
  return link;
};

export const ChadNavLinks = ({ closeNavbar, getLinkData }: LinksProps) => {
  const { username } = useContext(ChadContext);
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  let links;
  let chadLinks;
  if (!currentWeekNumber) {
    return null;
  }
  if (!username) {
    // only show links that don't require user to be logged in
    links = getLinkData("", currentWeekNumber);
    chadLinks = links.map((link) => {
      filterChildLinks(link);
      return (
        <ChadNavLink {...link} key={link.label} closeNavbar={closeNavbar} />
      );
    });
  } else {
    // can show all links if user is logged in
    links = getLinkData(username, currentWeekNumber);
    chadLinks = links.map((link) => (
      <ChadNavLink {...link} key={link.label} closeNavbar={closeNavbar} />
    ));
  }
  return <Navbar.Section>{chadLinks}</Navbar.Section>;
};
