import { combineReducers } from "redux";

import monsters from "./monstersReducer";
import tables from "./tablesReducer";
import items from "./itemReducers";

export default combineReducers({ monsters, tables, items });
