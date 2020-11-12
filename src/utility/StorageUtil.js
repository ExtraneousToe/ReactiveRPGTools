import Data from "../data/system-state.json";
import Index from "../data/bestiary/index.json";
import { Monster } from "../data/Monster";
import { HarvestingTable } from "../data/HarvestingTable";
import { TrinketTable } from "../data/TrinketTable";
import { CraftableItem } from "../data/CraftableItem";
import { HarvestedItem } from "../data/HarvestedItem";
import {
  addCraftableItems,
  addHarvestedItems,
  addHarvestingTables,
  addMonsters,
  addSubMonsters,
  addTrinketTables,
} from "../redux/actions";
import store from "../redux/store";

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
    if (process.env.NODE_ENV === "development") {
      console.log(`[${localKey}] already done.`);
    }
    return;
  } else if (Storage.processingKeys.includes(localKey.toLowerCase())) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${localKey}] being processed.`);
    }
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
        if (process.env.NODE_ENV === "development") {
          console.log(
            `Starting on key[${depKey.toLowerCase()}] required as a dependency of [${localKey.toLowerCase()}]`
          );
        }
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
      if (process.env.NODE_ENV === "development") {
        console.error(
          `Loading on monster: ${mon.name} in file: ${fileName} failed.\n${err}`
        );
      }
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
  harvestedItemDict: {},
  trinketTableDict: {},
  craftableItemDict: {},

  processingKeys: [],
  processedKeys: [],

  delayedMonsters: [],

  Init: async () => {
    if (Storage._init) {
      if (process.env.NODE_ENV === "development") {
        console.log("Storage already initialised");
      }
      return;
    }

    for (let idx = 0; idx < Data.harvestingTables.length; ++idx) {
      let harvestingTable = new HarvestingTable(Data.harvestingTables[idx]);
      Storage.harvestingTableDict[harvestingTable.name] = harvestingTable;
    }

    for (let idx = 0; idx < Data.harvestedItems.length; ++idx) {
      let harvestedItem = new HarvestedItem(Data.harvestedItems[idx]);
      Storage.harvestedItemDict[harvestedItem.id] = harvestedItem;
    }

    for (let idx = 0; idx < Data.trinketTables.length; ++idx) {
      let trinketTable = new TrinketTable(Data.trinketTables[idx]);
      Storage.trinketTableDict[trinketTable.trinketTableType] = trinketTable;
    }

    for (let idx = 0; idx < Data.craftableItems.length; ++idx) {
      let craftableItem = new CraftableItem(Data.craftableItems[idx]);
      Storage.craftableItemDict[craftableItem.id] = craftableItem;
    }

    store.dispatch(
      addHarvestingTables(Object.values(Storage.harvestingTableDict))
    );
    store.dispatch(addHarvestedItems(Object.values(Storage.harvestedItemDict)));
    store.dispatch(addTrinketTables(Object.values(Storage.trinketTableDict)));
    store.dispatch(addCraftableItems(Object.values(Storage.craftableItemDict)));

    // TODO: Uncomment the below to 'clean house'
    // delete Storage.harvestingTableDict;
    // delete Storage.harvestedItemDict;
    // delete Storage.trinketTableDict;
    delete Storage.craftableItemDict;

    for (let key in Index) {
      if (process.env.NODE_ENV === "development") {
        console.log(`${key} :: ${Index[key]}`);
      }

      await Load5eMonsterFile({ key: key, fileName: Index[key] });
    }

    for (let idx = 0; idx < Data.monsters.length; ++idx) {
      let monster = new SubStateMonster(Data.monsters[idx]);
      Storage.subStateMonsterDict[monster.id] = monster;
    }

    store.dispatch(addSubMonsters(Object.values(Storage.subStateMonsterDict)));
    store.dispatch(addMonsters(Object.values(Storage.monsterDict)));

    delete Storage.monsterDict;
    delete Storage.subStateMonsterDict;

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

  get id() {
    return (
      this.name.replace(/[\s'\-()]/g, "") +
      "_" +
      this.source
    ).toLowerCase();
  }
}
