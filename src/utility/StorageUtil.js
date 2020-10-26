import Data from "../data/system-state.json";
import Index from "../data/bestiary/index.json";
//import Index_MM from "../data/bestiary/bestiary-mm.json";
// import { getItemReferenceFromName } from "./harvestedItemUtil";
// import { getIdFromMonster } from "./monsterUtil";
// import { getIdFromItemName } from "./craftableItemUtil";
import { Monster } from "../data/Monster";
const $ = window.$;

async function ajaxJson(fileName) {
  return new Promise((resolve, reject) => {
    $.getJSON(`data/bestiary/${fileName}`, (data) => {
      resolve(data);
    });
  });
}

async function Load5eMonsterFile({ key, fileName }) {
  let localKey = key;

  // check if already processed or already being processed
  if (Storage.processedKeys.includes(localKey.toLowerCase())) {
    console.log(`[${localKey}] already done.`);
    return;
  } else if (Storage.processingKeys.includes(localKey.toLowerCase())) {
    console.log(`[${localKey}] being processed.`);
    return;
  }

  Storage.processingKeys.push(localKey.toLowerCase());

  console.log(`Starting on key[${localKey.toLowerCase()}]`);

  var data = await ajaxJson(fileName);
  if (data._meta) {
    var meta = data._meta;
    // await for any dependencies to be loaded in
    if (meta.dependencies && meta.dependencies.monster) {
      for (let jdx = 0; jdx < meta.dependencies.monster.length; ++jdx) {
        var depKey = meta.dependencies.monster[jdx];
        console.log(
          `Starting on key[${depKey.toLowerCase()}] required as a dependency of [${localKey.toLowerCase()}]`
        );
        await Load5eMonsterFile({
          key: depKey,
          fileName: `bestiary-${depKey.toLowerCase()}.json`,
        });
      }
    }
  }

  for (let idx = 0; idx < data.monster.length; ++idx) {
    let mon = data.monster[idx];

    if (mon._copy) {
      // console.log(
      //   `For now, skipping _copy prop monsters ... on ${mon.name}`
      // );
      continue;
    }

    try {
      mon = Monster.from5eSource(mon);

      if (!Storage.monsterDict[mon.id]) {
        Storage.monsterDict[mon.id] = mon;
      }
    } catch (err) {
      console.error(
        `Loading on monster: ${mon.name} in file: ${fileName} failed.`
      );
    }
  }

  console.log(`${localKey} processed.`);
  Storage.processedKeys.push(localKey.toLowerCase());
}

// let initialised = false;
const Storage = {
  _init: false,

  // dictionaries
  monsterDict: {},
  harvestableItemDict: {},
  trinketTableDict: {},
  craftableItemDict: {},
  processingKeys: [],
  processedKeys: [],

  Init: async () => {
    if (Storage._init) {
      console.log("Storage already initialised");
      return;
    }

    //let idReplaceRegex = /[\s'\-()]/g;

    for (let key in Index) {
      console.log(`${key} :: ${Index[key]}`);

      await Load5eMonsterFile({ key: key, fileName: Index[key] });
    }

    // process all 5eTools files first
    // for (let idx = 0; idx < Index_MM.monster.length; ++idx) {
    //   let mon = Index_MM.monster[idx];
    //   feMonsters[mon.name.replace(idReplaceRegex, "") + "_" + mon.source] = mon;
    //   mon = Monster.from5eSource(mon);

    //   if (!Storage.monsterDict[mon.id]) {
    //     Storage.monsterDict[mon.id] = mon;
    //   }
    // }

    // for (let idx = 0; idx < Data.Monsters.length; ++idx) {
    //   let monster = Data.Monsters[idx];

    //   oldMonsters[
    //     monster.Name.replace(idReplaceRegex, "") + "_" + monster.PrimarySource
    //   ] = monster;
    // }

    // let monsterKeys = Object.keys(Storage.monsterDict);
    // for (let idx = 0; idx < monsterKeys.length; ++idx) {
    //   //console.log(monsterKeys[idx]);
    // }

    Storage._init = true;
    /*
    for (
      let idx = 0;
      Data.CraftableItems !== undefined && idx < Data.CraftableItems.length;
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
            Type: "",
            Crafter: "",
            Rarity: "",
            RequiresAttunement: false,
            AttunementNote: "",
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
          let existingEntry = filteredList.length > 0 ? filteredList[0] : null;

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
          ) {
            item.MaterialGrouping = "OR";
          }
          if (
            item.AttunementNote === null ||
            item.AttunementNote === undefined
          ) {
            item.AttunementNote = "";
          }
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

      Storage.harvestableItemDict[harvestedItem.ReferenceId] = harvestedItem;
    }

    for (let idx = 0; idx < Data.TrinketTables.length; ++idx) {
      let trinketTable = Data.TrinketTables[idx];
      Storage.trinketTableDict[trinketTable.TrinketTableType] = trinketTable;
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
          console.log(`Creating new HarvestedItem: ${row.ItemNameRef}`);
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
      */
  },
};

export default Storage;
