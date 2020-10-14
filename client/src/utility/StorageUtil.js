import Data from "../data/system-state.json";
import {
    getItemReference,
    getItemReferenceFromName,
} from "./harvestedItemUtil";
import { getIdFromMonster } from "./monsterUtil";

// let initialised = false;
const Storage = {
    _init: false,

    // lists
    monsterList: [],

    // dictionaries
    monsterDict: {},
    harvestableItemDict: {},
    trinketTableDict: {},

    Init: () => {
        if (Storage._init) {
            console.log("Storage already initialised");
            return;
        }

        Storage.monsterList = Data.Monsters;
        for (let idx = 0; idx < Storage.monsterList.length; ++idx) {
            let monster = Storage.monsterList[idx];

            for (let j = 0; j < monster.HarvestingTable.Rows.length; ++j) {
                monster.HarvestingTable.Rows[
                    j
                ].ItemNameRef = getItemReferenceFromName(
                    monster.HarvestingTable.Rows[j].ItemNameRef
                );
            }
            Storage.monsterDict[getIdFromMonster(monster)] = monster;
        }

        Storage.harvestableItemList = Data.HarvestedItems;
        for (let idx = 0; idx < Storage.harvestableItemList.length; ++idx) {
            let harvestedItem = Storage.harvestableItemList[idx];

            harvestedItem.Description.Paragraphs = harvestedItem.Description.Paragraphs.filter(
                (line) => line !== ""
            );
            harvestedItem.UseText.Paragraphs = harvestedItem.UseText.Paragraphs.filter(
                (line) => line !== ""
            );

            if (
                harvestedItem.Quantity === null ||
                harvestedItem.Quantity === undefined
            ) {
                harvestedItem.Quantity = "";
            }

            if (
                harvestedItem.CraftingUsage === null ||
                harvestedItem.CraftingUsage === undefined
            ) {
                harvestedItem.CraftingUsage = [];
            } else if (typeof harvestedItem.CraftingUsage === "string") {
                harvestedItem.CraftingUsage = [harvestedItem.CraftingUsage];
            }

            Storage.harvestableItemDict[
                getItemReference(harvestedItem)
            ] = harvestedItem;
        }

        Storage.trinketTableList = Data.TrinketTables;
        for (let idx = 0; idx < Storage.trinketTableList.length; ++idx) {
            let trinketTable = Storage.trinketTableList[idx];
            Storage.trinketTableDict[
                trinketTable.TrinketTableType
            ] = trinketTable;
        }

        Storage._init = true;
        // console.log(JSON.stringify(Storage));
    },
};

export default Storage;
