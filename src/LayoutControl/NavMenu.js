import React, { useContext } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";

import { MENU } from "../navigationConstants";
import { AppTheme } from "../themeContext";

export function NavMenu(props) {
  const appTheme = useContext(AppTheme);

  let navOutput = [];
  for (let i = 0; i < MENU.length; ++i) {
    let linkDeets = MENU[i];
    navOutput.push(
      <NavItem key={i} nav="true">
        <NavLink
          tag={Link}
          className={linkDeets.className + " " + appTheme.theme.navbarTextClass}
          to={linkDeets.linkTarget}
        >
          {linkDeets.linkName}
        </NavLink>
      </NavItem>
    );
  }

  return (
    <header>
      <Navbar
        className="border-bottom p-0"
        expand
        {...appTheme.theme.navbarLightDark}
        color={appTheme.theme.navbarColour}
      >
        <button onClick={() => appTheme.cycleTheme(appTheme)}>
          Toggle theme
        </button>
        <Container>
          <NavbarBrand tag={Link} to="/">
            Reactive RPG
          </NavbarBrand>
          <Nav
            navbar
            className="d-sm-inline-flex flex-sm-row"
            //className="mr-auto"
          >
            {/* <ul className="navbar-nav flex-grow"> */}
            {navOutput}
            {/* </ul> */}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}
