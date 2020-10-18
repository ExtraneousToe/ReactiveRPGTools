import React from "react";
import { Container } from "react-bootstrap";
import { NavMenu } from "./NavMenu";
import "./Layout.css";

export function Layout(props) {
    return (
        <div className="viewportWrapper">
            <NavMenu />
            <Container fluid className="mainContentWrapper">
                {props.children}
            </Container>
        </div>
    );
}
