import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { NavbarBrand, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";

import { MENU } from "../navigationConstants";

export function NavMenu(props) {
    let navOutput = [];
    for (let i = 0; i < MENU.length; ++i) {
        let linkDeets = MENU[i];
        navOutput.push(
            <NavItem key={i}>
                <NavLink
                    tag={Link}
                    className={linkDeets.className}
                    to={linkDeets.linkTarget}
                >
                    {linkDeets.linkName}
                </NavLink>
            </NavItem>
        );
    }

    return (
        <header>
            <Navbar className="border-bottom p-0">
                <Container>
                    <NavbarBrand tag={Link} to="/">
                        Reactive RPG
                    </NavbarBrand>
                    <Container
                        className="d-sm-inline-flex flex-sm-row-reverse"
                        navbar="true"
                    >
                        <ul className="navbar-nav flex-grow">{navOutput}</ul>
                    </Container>
                </Container>
            </Navbar>
        </header>
    );
}
