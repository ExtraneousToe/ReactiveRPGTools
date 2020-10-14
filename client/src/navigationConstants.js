import React from "react";
import { Monsters } from "./pages/Monsters";
import { fileSaveAs } from "./utility/saveFile";
import Storage from "./utility/StorageUtil";

export const MENU = [
    {
        className: "text-dark",
        linkName: "Home",
        linkTarget: "/",
        routePaths: ["/"],
        exact: true,
        renderFunction: (props) => {
            return (
                <div>
                    <h1>Home</h1>
                    <div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                fileSaveAs(
                                    "system-state.json",
                                    JSON.stringify({
                                        Monsters: Storage.monsterList,
                                        HarvestedItems:
                                            Storage.harvestableItemList,
                                        TrinketTables: Storage.trinketTableList,
                                    })
                                );
                            }}
                        >
                            Save State
                        </button>
                    </div>
                    <div>
                        <input
                            type="text"
                            style={{ width: "100%", height: "4em" }}
                        />
                    </div>
                </div>
            );
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
