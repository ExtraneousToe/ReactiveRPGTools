import React from "react";
import { Route, Switch } from "react-router-dom";
import { Layout } from "./LayoutControl/Layout";
import "./App.css";

import { MENU } from "./navigationConstants";

function App() {
    let routeOpts = [];
    for (let i = 0; i < MENU.length; ++i) {
        let linkDeets = MENU[i];
        routeOpts.push(
            <Route
                key={i}
                path={linkDeets.routePaths[0]}
                render={(props) => linkDeets.renderFunction(props)}
                exact={linkDeets.exact}
            />
        );
    }

    return (
        <Layout>
            <Switch>{routeOpts}</Switch>
        </Layout>
    );
}

export default App;
