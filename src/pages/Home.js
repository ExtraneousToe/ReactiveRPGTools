import React from "react";
import { fileSaveAs } from "../utility/saveFile";
// import Storage from "../utility/StorageUtil";
import { sortAscending } from "../utility/stringUtil";
import { connect } from "react-redux";
import {
  getSubMonsterDict,
  getHarvestedItemDict,
  getHarvestingTableDict,
  getTrinketTableDict,
  getCraftableItemDict,
} from "../redux/selectors";

export default connect((store) => ({
  subStateMonsterDict: getSubMonsterDict(store),
  harvestedItemDict: getHarvestedItemDict(store),
  harvestingTableDict: getHarvestingTableDict(store),
  trinketTableDict: getTrinketTableDict(store),
  craftableItemDict: getCraftableItemDict(store),
}))(Home);

function Home(props) {
  return (
    <div>
      <h1>Home</h1>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();

            let monsters = Object.values(props.subStateMonsterDict);
            monsters.sort((a, b) => sortAscending(a.id, b.id));

            let harvestedItems = Object.values(props.harvestedItemDict);
            harvestedItems.sort((a, b) => sortAscending(a.id, b.id));

            let harvestingTables = Object.values(props.harvestingTableDict);
            harvestingTables.sort((a, b) => sortAscending(a.name, b.name));

            let trinketTables = Object.values(props.trinketTableDict);
            trinketTables.sort((a, b) =>
              sortAscending(a.trinketTableType, b.trinketTableType)
            );

            let craftableItems = Object.values(props.craftableItemDict);
            craftableItems.sort((a, b) => sortAscending(a.id, b.id));

            fileSaveAs(
              "system-state.json",
              JSON.stringify({
                monsters: monsters,
                harvestingTables: harvestingTables,
                harvestedItems: harvestedItems,
                trinketTables: trinketTables,
                craftableItems: craftableItems,
              })
            );
          }}
        >
          Save State
        </button>
      </div>
      {/* <div>
        <input type="text" style={{ width: "100%", height: "4em" }} />
      </div> */}
      {/* <div>{JSON.stringify(props)}</div> */}
      {/* <div>{JSON.stringify(process.env)}</div> */}
    </div>
  );
}
