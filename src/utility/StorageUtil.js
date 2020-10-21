import Data from "../data/system-state.json";
import { getItemReferenceFromName } from "./harvestedItemUtil";
import { getIdFromMonster } from "./monsterUtil";
import { getIdFromItemName } from "./craftableItemUtil";

// let initialised = false;
const Storage = {
    _init: false,

    // dictionaries
    monsterDict: {},
    harvestableItemDict: {},
    trinketTableDict: {},
    craftableItemDict: {},

    Init: () => {
        if (Storage._init) {
            console.log("Storage already initialised");
            return;
        }

        for (
            let idx = 0;
            Data.CraftableItems !== undefined &&
            idx < Data.CraftableItems.length;
            ++idx
        ) {
            let craftableItem = Data.CraftableItems[idx];
            Storage.craftableItemDict[craftableItem.Id] = craftableItem;
        }

        for (let idx = 0; idx < Data.HarvestedItems.length; ++idx) {
            let harvestedItem = Data.HarvestedItems[idx];

            harvestedItem.Description = harvestedItem.Description.filter(
                (line) => line !== ""
            );
            harvestedItem.UseText = harvestedItem.UseText.filter(
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
            } else {
                harvestedItem.CraftingUsage = harvestedItem.CraftingUsage.filter(
                    (line) => line !== ""
                );
            }

            for (let i = 0; i < harvestedItem.CraftingUsage.length; ++i) {
                let name = harvestedItem.CraftingUsage[i];
                let id = getIdFromItemName(name);
                if (Storage.craftableItemDict[id] === undefined) {
                    Storage.craftableItemDict[id] = {
                        Id: id,
                        Name: name,
                        Type: null,
                        Crafter: null,
                        Rarity: null,
                        RequiresAttunement: false,
                        Description: [],
                        Materials: [
                            {
                                ComponentId: harvestedItem.ReferenceId,
                                Quantity: "x1",
                            },
                        ],
                        MaterialGrouping: "OR",
                    };
                } else {
                    let item = Storage.craftableItemDict[id];
                    let filteredList = item.Materials.filter(
                        (mat) => mat.ComponentId === harvestedItem.ReferenceId
                    );
                    let existingEntry =
                        filteredList.length > 0 ? filteredList[0] : null;

                    if (existingEntry === null) {
                        item.Materials.push({
                            ComponentId: harvestedItem.ReferenceId,
                            Quantity: "x1",
                        });
                    } else if (existingEntry.Quantity === null) {
                        existingEntry.Quantity = "x1";
                    }

                    if (item.Type === null || item.Type === undefined)
                        item.Type = "Wondrous item";
                    if (item.Crafter === null) item.Crafter = "";
                    if (item.Rarity === null) item.Rarity = "";
                    if (
                        item.MaterialGrouping === null ||
                        item.MaterialGrouping === undefined
                    )
                        item.MaterialGrouping = "OR";
                }
            }

            if (
                harvestedItem.RequiredToolNames === null ||
                harvestedItem.RequiredToolNames === undefined
            ) {
                harvestedItem.RequiredToolNames = [];
            } else {
                harvestedItem.RequiredToolNames = harvestedItem.RequiredToolNames.filter(
                    (line) => line !== ""
                );
            }

            if (harvestedItem.ReferenceId === undefined) {
                harvestedItem.ReferenceId = getItemReferenceFromName(
                    harvestedItem.Name
                );
            }

            Storage.harvestableItemDict[
                harvestedItem.ReferenceId
            ] = harvestedItem;
        }

        for (let idx = 0; idx < Data.TrinketTables.length; ++idx) {
            let trinketTable = Data.TrinketTables[idx];
            Storage.trinketTableDict[
                trinketTable.TrinketTableType
            ] = trinketTable;
        }

        for (let idx = 0; idx < Data.Monsters.length; ++idx) {
            let monster = Data.Monsters[idx];

            for (let j = 0; j < monster.HarvestingTable.Rows.length; ++j) {
                let row = monster.HarvestingTable.Rows[j];

                row.ItemNameRef = getItemReferenceFromName(
                    monster.HarvestingTable.Rows[j].ItemNameRef
                );

                if (row.Quantity === undefined) {
                    row.Quantity = "";
                }

                if (row.Notes === undefined) {
                    row.Notes = "";
                }

                let existingItem = Storage.harvestableItemDict[row.ItemNameRef];
                if (existingItem !== undefined) {
                    if (
                        existingItem.Quantity !== "" &&
                        existingItem.Quantity !== undefined &&
                        existingItem.Quantity !== null &&
                        row.Quantity === ""
                    ) {
                        row.Quantity = existingItem.Quantity;
                    }
                    if (
                        existingItem.Notes !== "" &&
                        existingItem.Notes !== undefined &&
                        existingItem.Notes !== null &&
                        row.Notes === ""
                    ) {
                        row.Notes = existingItem.Notes;
                    }
                } else {
                    console.log(
                        `Creating new HarvestedItem: ${row.ItemNameRef}`
                    );
                    Storage.harvestableItemDict[row.ItemNameRef] = {
                        ReferenceId: row.ItemNameRef,
                        Name: row.ItemNameRef,
                        UseText: [],
                        RequiredToolNames: [],
                        CraftingUsage: [],
                        Description: [],
                        ValueGP: "-",
                        WeightLB: "-",
                    };
                }
            }

            Storage.monsterDict[getIdFromMonster(monster)] = monster;
        }

        let hItems = Object.values(Storage.harvestableItemDict);
        for (let i = 0; i < hItems.length; ++i) {
            hItems[i].Quantity = undefined;
            hItems[i].Notes = undefined;
            hItems[i].IsConsumable = undefined;
        }

        Storage._init = true;
    },
};

export default Storage;
