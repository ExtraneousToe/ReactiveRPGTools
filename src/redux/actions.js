import TYPES from "./actionTypes";

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
