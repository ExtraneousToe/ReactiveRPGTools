import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { NavMenu } from "./NavMenu";
import AppTheme from "../themeContext";

import "../css/Layout.css";
import "../css/App.css";

export function Layout(props) {
  const context = useContext(AppTheme);

  return (
    <div className={`viewportWrapper ${context.theme.styleName}`}>
      <NavMenu toggleTheme={props.toggleTheme} />
      <Container fluid className="mainContentWrapper">
        {props.children}
      </Container>
    </div>
  );
}
