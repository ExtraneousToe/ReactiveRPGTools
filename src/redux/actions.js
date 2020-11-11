import TYPES from "./actionTypes";

// Monsters
export const addMonster = (monster) => ({
  type: TYPES.ADD_MONSTER,
  payload: monster,
});

export const addMonsters = (monsters) => ({
  type: TYPES.ADD_MONSTERS,
  payload: monsters,
});

export const addSubMonster = (subMonster) => ({
  type: TYPES.ADD_SUB_MONSTER,
  payload: subMonster,
});

export const addSubMonsters = (subMonsters) => ({
  type: TYPES.ADD_SUB_MONSTERS,
  payload: subMonsters,
});

export const selectMonster = (monsterId) => ({
  type: TYPES.SELECT_MONSTER,
  payload: monsterId,
});

// Tables
export const addHarvestingTable = (harvestingTable) => ({
  type: TYPES.ADD_HARVESTING_TABLE,
  payload: harvestingTable,
});

export const addHarvestingTables = (harvestingTables) => ({
  type: TYPES.ADD_HARVESTING_TABLES,
  payload: harvestingTables,
});

export const addTrinketTable = (trinketTable) => ({
  type: TYPES.ADD_TRINKET_TABLE,
  payload: trinketTable,
});

export const addTrinketTables = (trinketTables) => ({
  type: TYPES.ADD_TRINKET_TABLES,
  payload: trinketTables,
});

// Items
export const addHarvestedItem = (harvestedItem) => ({
  type: TYPES.ADD_HARVESTED_ITEM,
  payload: harvestedItem,
});

export const addHarvestedItems = (harvestedItems) => ({
  type: TYPES.ADD_HARVESTED_ITEMS,
  payload: harvestedItems,
});

export const addCraftableItem = (craftableItem) => ({
  type: TYPES.ADD_CRAFTABLE_ITEM,
  payload: craftableItem,
});

export const addCraftableItems = (craftableItems) => ({
  type: TYPES.ADD_CRAFTABLE_ITEMS,
  payload: craftableItems,
});
