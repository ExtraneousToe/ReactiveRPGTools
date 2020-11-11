import TYPES from "../actionTypes";

const initialState = {
  harvestedItemDict: {},
  craftableItemDict: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TYPES.ADD_HARVESTED_ITEM: {
      // TODO: ?
      return null;
    }
    case TYPES.ADD_HARVESTED_ITEMS: {
      const harvestedItems = action.payload;

      let noChange = true;
      let harvestedItemDict = { ...state.harvestedItemDict };

      harvestedItems.forEach((hItem, idx) => {
        if (harvestedItemDict[hItem.id] === undefined) {
          harvestedItemDict[hItem.id] = hItem;
          noChange = false;
        }
      });

      if (noChange) {
        return state;
      } else {
        return {
          ...state,
          harvestedItemDict: harvestedItemDict,
        };
      }
    }
    case TYPES.ADD_CRAFTABLE_ITEM: {
      // TODO: ?
      return null;
    }
    case TYPES.ADD_CRAFTABLE_ITEMS: {
      const craftableItems = action.payload;

      let noChange = true;
      let craftableItemDict = { ...state.craftableItemDict };

      craftableItems.forEach((cItem, idx) => {
        if (craftableItemDict[cItem.id] === undefined) {
          craftableItemDict[cItem.id] = cItem;
          noChange = false;
        }
      });

      if (noChange) {
        return state;
      } else {
        return {
          ...state,
          craftableItemDict: craftableItemDict,
        };
      }
    }
    default:
      return state;
  }
}
