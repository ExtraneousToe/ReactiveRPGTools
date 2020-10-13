import React from "react";
import { Monsters } from "./pages/Monsters";

export const MENU = [
    {
        className: "text-dark",
        linkName: "Home",
        linkTarget: "/",
        routePaths: ["/"],
        exact: true,
        renderFunction: (props) => {
            return <span>Home</span>;
        },
    },
    {
        className: "text-dark",
        linkName: "Monsters",
        linkTarget: "/monsters",
        routePaths: ["/monsters"],
        exact: false,
        renderFunction: (props) => {
            return <Monsters {...props} />;
        },
    },
    {
        className: "text-dark",
        linkName: "Harvested Items",
        linkTarget: "/harvesteditems",
        routePaths: ["/harvesteditems"],
        exact: false,
        renderFunction: (props) => {
            return <span>Harvested Items</span>;
        },
    },
    {
        className: "text-dark",
        linkName: "Trinket Tables",
        linkTarget: "/trinkettables",
        routePaths: ["/trinkettables"],
        exact: false,
        renderFunction: (props) => {
            return <span>Trinket Tables</span>;
        },
    },
];
