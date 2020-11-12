// monsters
export const getMonsterDict = (store) => store.monsters.monsterDict;
export const getSubMonsterDict = (store) => store.monsters.subMonsterDict;
export const getSelectedMonsterId = (store) => store.monsters.selectedMonsterId;

export const getHarvestingTableDict = (store) =>
  store.tables.harvestingTableDict;
export const getTrinketTableDict = (store) => store.tables.trinketTableDict;

export const getHarvestedItemDict = (store) => store.items.harvestedItemDict;
export const getSelectedHarvestedItemId = (store) =>
  store.items.selectedHarvestedItemId;

export const getCraftableItemDict = (store) => store.items.craftableItemDict;
export const getSelectedCraftableItemId = (store) =>
  store.items.selectedCraftableItemId;
