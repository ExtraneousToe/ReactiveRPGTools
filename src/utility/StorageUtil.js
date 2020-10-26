import Data from "../data/system-state.json";
import Index from "../data/bestiary/index.json";
//import Index_MM from "../data/bestiary/bestiary-mm.json";
import { getItemReferenceFromName } from "./harvestedItemUtil";
import { getIdFromMonster } from "./monsterUtil";
import { getIdFromItemName } from "./craftableItemUtil";
import { Monster } from "../data/Monster";
import { HarvestingTable } from "../data/HarvestingTable";
import { TrinketTable } from "../data/TrinketTable";
import { CraftableItem } from "../data/CraftableItem";
import { HarvestedItem } from "../data/HarvestedItem";

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

  subStateMonsterDict: {},
  harvestingTableDict: {},

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

    for (let key in Index) {
      console.log(`${key} :: ${Index[key]}`);

      await Load5eMonsterFile({ key: key, fileName: Index[key] });
    }

    // for (let idx = 0; idx < Data.TrinketTables.length; ++idx) {
    //   let trinketTable = TrinketTable.fromOld(Data.TrinketTables[idx]);
    //   Storage.trinketTableDict[trinketTable.trinketTableType] = trinketTable;
    // }
    for (let idx = 0; idx < Data.trinketTables.length; ++idx) {
      let trinketTable = new TrinketTable(Data.trinketTables[idx]);
      Storage.trinketTableDict[trinketTable.trinketTableType] = trinketTable;
    }

    // for (let idx = 0; idx < Data.Monsters.length; ++idx) {
    //   let monster = Data.Monsters[idx];

    //   let harvestingTable =
    //     monster.HarvestingTable.Rows.length > 0
    //       ? HarvestingTable.fromOld(monster)
    //       : null;
    //   monster = new SubStateMonster(monster, harvestingTable);

    //   Storage.subStateMonsterDict[getIdFromMonster(monster)] = monster;
    //   if (harvestingTable) {
    //     Storage.harvestingTableDict[harvestingTable.name] = harvestingTable;
    //   }
    // }

    for (let idx = 0; idx < Data.monsters.length; ++idx) {
      let monster = Data.monsters[idx];
      Storage.subStateMonsterDict[getIdFromMonster(monster)] = monster;
    }

    for (let idx = 0; idx < Data.harvestingTables.length; ++idx) {
      let harvestingTable = new HarvestingTable(Data.harvestingTables[idx]);
      Storage.harvestingTableDict[harvestingTable.name] = harvestingTable;
    }

    // for (let idx = 0; idx < Data.CraftableItems.length; ++idx) {
    //   let craftableItem = CraftableItem.fromOld(Data.CraftableItems[idx]);
    //   Storage.craftableItemDict[craftableItem.id] = craftableItem;
    // }

    for (let idx = 0; idx < Data.craftableItems.length; ++idx) {
      let craftableItem = new CraftableItem(Data.craftableItems[idx]);
      Storage.craftableItemDict[craftableItem.id] = craftableItem;
    }

    // for (let idx = 0; idx < Data.HarvestedItems.length; ++idx) {
    //   let harvestedItem = HarvestedItem.fromOld(Data.HarvestedItems[idx]);
    //   Storage.harvestableItemDict[harvestedItem.id] = harvestedItem;
    // }

    for (let idx = 0; idx < Data.harvestedItems.length; ++idx) {
      let harvestedItem = new HarvestedItem(Data.harvestedItems[idx]);
      Storage.harvestableItemDict[harvestedItem.id] = harvestedItem;
    }
    Storage._init = true;
  },
};

window.storage = Storage;
export default Storage;

class SubStateMonster {
  constructor({
    name,
    cardSize,
    source,
    trinketTableType,
    harvestingTableGroup,
  }) {
    this.name = name;
    this.cardSize = cardSize;
    this.source = source;
    this.trinketTableType = trinketTableType;
    this.harvestingTableGroup = harvestingTableGroup;
  }
}
