import TYPES from "../actionTypes";

const initialState = {
  monsterDict: {},
  subMonsterDict: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TYPES.ADD_MONSTER: {
      const { id } = action.payload;
      if (state.monsterDict[id]) {
        return state;
      }

      let monsterDict = { ...state.monsterDict };
      monsterDict[id] = action.payload;

      return {
        ...state,
        monsterDict: monsterDict,
      };
    }
    case TYPES.ADD_MONSTERS: {
      const monsters = action.payload;

      let noChange = true;
      let monsterDict = { ...state.monsterDict };

      monsters.forEach((mon, idx) => {
        if (monsterDict[mon.id] === undefined) {
          monsterDict[mon.id] = mon;
          noChange = false;
        }
      });

      if (noChange) {
        return state;
      } else {
        return {
          ...state,
          monsterDict: monsterDict,
        };
      }
    }
    case TYPES.ADD_SUB_MONSTER: {
      const { id } = action.payload;
      if (state.subMonsterDict[id]) {
        return state;
      }

      let subMonsterDict = { ...state.subMonsterDict };
      subMonsterDict[id] = action.payload;

      return {
        ...state,
        subMonsterDict: subMonsterDict,
      };
    }
    case TYPES.ADD_SUB_MONSTERS: {
      const monsters = action.payload;

      let noChange = true;
      let subMonsterDict = { ...state.subMonsterDict };

      monsters.forEach((mon, idx) => {
        if (subMonsterDict[mon.id] === undefined) {
          subMonsterDict[mon.id] = mon;
          noChange = false;
        }
      });

      if (noChange) {
        return state;
      } else {
        return {
          ...state,
          subMonsterDict: subMonsterDict,
        };
      }
    }
    default:
      return state;
  }
}
