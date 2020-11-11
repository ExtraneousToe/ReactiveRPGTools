import React from "react";
import { Home } from "./pages/Home";
import Monsters from "./pages/Monsters";
import { HarvestedItems } from "./pages/HarvestedItems";
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
