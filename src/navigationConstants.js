import React from "react";
import { HarvestedItems } from "./pages/HarvestedItems";
import { Monsters } from "./pages/Monsters";
import { fileSaveAs } from "./utility/saveFile";
import Storage from "./utility/StorageUtil";
import { sortAscending } from "./utility/stringUtil";

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

                                let monsters = Object.values(
                                    Storage.monsterDict
                                );
                                monsters.sort((a, b) =>
                                    sortAscending(a.Name, b.Name)
                                );

                                let harvestedItems = Object.values(
                                    Storage.harvestableItemDict
                                );
                                harvestedItems.sort((a, b) =>
                                    sortAscending(a.ReferenceId, b.ReferenceId)
                                );

                                let trinketTables = Object.values(
                                    Storage.trinketTableDict
                                );
                                trinketTables.sort((a, b) =>
                                    sortAscending(
                                        a.TrinketTableType,
                                        b.TrinketTableType
                                    )
                                );

                                fileSaveAs(
                                    "system-state.json",
                                    JSON.stringify({
                                        Monsters: monsters,
                                        HarvestedItems: harvestedItems,
                                        TrinketTables: trinketTables,
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
            return <HarvestedItems {...props} />;
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
