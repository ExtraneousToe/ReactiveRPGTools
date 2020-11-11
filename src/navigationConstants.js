import React from "react";
import { HarvestedItems } from "./pages/HarvestedItems";
import { Home } from "./pages/Home";
import Monsters from "./pages/Monsters";
import { CraftableItems } from "./pages/CraftableItems";

export const MENU = [
  {
    className: "",
    linkName: "Home",
    linkTarget: "/",
    routePaths: ["/"],
    exact: true,
    renderFunction: (props) => {
      return <Home {...props} />;
    },
  },
  {
    className: "",
    linkName: "Monsters",
    linkTarget: "/monsters",
    routePaths: ["/monsters"],
    exact: false,
    renderFunction: (props) => {
      return <Monsters {...props} />;
    },
  },
  {
    className: "",
    linkName: "Harvested Items",
    linkTarget: "/harvesteditems",
    routePaths: ["/harvesteditems"],
    exact: false,
    renderFunction: (props) => {
      return <HarvestedItems {...props} />;
    },
  },
  // {
  //     className: "text-dark",
  //     linkName: "Trinket Tables",
  //     linkTarget: "/trinkettables",
  //     routePaths: ["/trinkettables"],
  //     exact: false,
  //     renderFunction: (props) => {
  //         return <span>Trinket Tables</span>;
  //     },
  // },
  {
    className: "",
    linkName: "Craftable Items",
    linkTarget: "/craftableitems",
    routePaths: ["/craftableitems"],
    exact: false,
    renderFunction: (props) => {
      return <CraftableItems {...props} />;
    },
  },
];
