import React, { useContext, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Layout } from "./LayoutControl/Layout";
import { MENU } from "./navigationConstants";
import { AppTheme, themes } from "./themeContext";

function App() {
  const appTheme = useContext(AppTheme);
  const [themeState, setThemeState] = useState(appTheme);

  const toggleTheme = function (currentState) {
    const newTheme = { ...currentState };
    if (currentState.theme === themes.light) {
      newTheme.theme = themes.dark;
    } else {
      newTheme.theme = themes.light;
    }
    setThemeState(newTheme);
  };

  // set the function to handle easy theme toggling
  themeState.cycleTheme = toggleTheme;

  let routeOpts = [];
  for (let i = 0; i < MENU.length; ++i) {
    let linkDeets = MENU[i];
    routeOpts.push(
      <Route
        key={i}
        path={linkDeets.routePaths[0]}
        render={linkDeets.renderFunction}
        exact={linkDeets.exact}
      />
    );
  }

  return (
    <AppTheme.Provider value={themeState}>
      <Layout toggleTheme={toggleTheme}>
        <Switch>{routeOpts}</Switch>
      </Layout>
    </AppTheme.Provider>
  );
}

export default App;
