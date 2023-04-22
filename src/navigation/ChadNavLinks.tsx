import { useContext } from "react";

import { Navbar, Text } from "@mantine/core";

import { ChadNavLink } from "./ChadNavLink";
import { AuthContext } from "../store/auth-context";
import { useGetCurrentWeekNumber } from "../hooks/useGetCurrentWeekNumber";

export interface LinkData {
  icon: React.ReactNode;
  label: string;
  to: string;
  public?: boolean;
  privateChild?: boolean;
  childLinks?: LinkData[];
}

interface LinksProps {
  closeNavbar: () => void;
  getLinkData: (username: string, currentWeekNumber: number) => LinkData[];
  displayText: string;
}

export const ChadNavLinks = ({
  closeNavbar,
  getLinkData,
  displayText,
}: LinksProps) => {
  const { username } = useContext(AuthContext);
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();
  let links;
  let chadLinks;
  if (!currentWeekNumber) {
    return null;
  }
  if (!username) {
    // only show links that don't require user to be logged in
    links = getLinkData("", currentWeekNumber).filter((link) => link.public);
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
    links = getLinkData(username, currentWeekNumber);
    chadLinks = links.map((link) => (
      <ChadNavLink {...link} key={link.label} closeNavbar={closeNavbar} />
    ));
  }
  return (
    <>
      <Text
        style={{ marginTop: "1rem", fontWeight: "bold", fontStyle: "italic" }}
      >
        {displayText}
      </Text>
      <Navbar.Section>{chadLinks}</Navbar.Section>
    </>
  );
};
