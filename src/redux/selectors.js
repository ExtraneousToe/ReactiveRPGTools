export const getMonsterDict = (store) => store.monsters.monsterDict;
export const getSubMonsterDict = (store) => store.monsters.subMonsterDict;

export const getSelectedMonsterId = (store) => store.monsters.selectedMonsterId;
export const getSelectedMonster = (store) =>
  store.monsters[store.selectedMonsterId];
