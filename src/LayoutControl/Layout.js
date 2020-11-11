import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { NavMenu } from "./NavMenu";
import { AppTheme } from "../themeContext";

import "./Layout.css";
import "../App.css";

export function Layout(props) {
  const context = useContext(AppTheme);

  return (
    <div
      className={`viewportWrapper ${context.theme.styleName}`}
      //   style={{
      //     background: context.theme.background,
      //     color: context.theme.foreground,
      //   }}
    >
      <NavMenu toggleTheme={props.toggleTheme} />
      <Container fluid className="mainContentWrapper">
        {props.children}
      </Container>
    </div>
  );
}
