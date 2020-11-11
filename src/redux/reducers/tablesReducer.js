import TYPES from "../actionTypes";

const initialState = {
  harvestingTableDict: {},
  trinketTableDict: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TYPES.ADD_HARVESTING_TABLE: {
      // TODO: ?
      return null;
    }
    case TYPES.ADD_HARVESTING_TABLES: {
      const harvestingTables = action.payload;

      let noChange = true;
      let harvestingTableDict = { ...state.harvestingTableDict };

      harvestingTables.forEach((hTable, idx) => {
        if (harvestingTableDict[hTable.id] === undefined) {
          harvestingTableDict[hTable.id] = hTable;
          noChange = false;
        }
      });

      if (noChange) {
        return state;
      } else {
        return {
          ...state,
          harvestingTableDict: harvestingTableDict,
        };
      }
    }
    case TYPES.ADD_TRINKET_TABLE: {
      // TODO: ?
      return null;
    }
    case TYPES.ADD_TRINKET_TABLES: {
      const trinketTables = action.payload;

      let noChange = true;
      let trinketTableDict = { ...state.trinketTableDict };

      trinketTables.forEach((tTable, idx) => {
        if (trinketTableDict[tTable.id] === undefined) {
          trinketTableDict[tTable.id] = tTable;
          noChange = false;
        }
      });

      if (noChange) {
        return state;
      } else {
        return {
          ...state,
          trinketTableDict: trinketTableDict,
        };
      }
    }
    default:
      return state;
  }
}
