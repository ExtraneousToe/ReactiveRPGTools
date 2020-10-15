import React from "react";
import { Container } from "reactstrap";
import { NavMenu } from "./NavMenu";

export function Layout(props) {
    return (
        <>
            <NavMenu />
            <Container fluid>{props.children}</Container>
        </>
    );
}
