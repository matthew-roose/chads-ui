import { Link, useLocation } from "react-router-dom";

import { NavLink } from "@mantine/core";

interface ChadNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  closeNavbar?: () => void;
  childLinks?: ChadNavLinkProps[];
}

export const ChadNavLink = ({
  to,
  icon,
  label,
  closeNavbar,
  childLinks,
}: ChadNavLinkProps) => {
  const location = useLocation();
  if (!childLinks) {
    return (
      <NavLink
        label={label}
        icon={icon}
        component={Link}
        to={to}
        onClick={closeNavbar}
        color="blue"
        active={location.pathname === to}
      />
    );
  }
  return (
    <NavLink label={label} icon={icon}>
      {childLinks.map((link) => (
        <NavLink
          label={link.label}
          key={link.label}
          icon={link.icon}
          component={Link}
          to={link.to}
          onClick={closeNavbar}
          color="blue"
          active={location.pathname === link.to}
        />
      ))}
    </NavLink>
  );
};
