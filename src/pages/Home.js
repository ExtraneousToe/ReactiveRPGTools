import React from "react";
import { fileSaveAs } from "../utility/saveFile";
import Storage from "../utility/StorageUtil";
import { sortAscending } from "../utility/stringUtil";

export function Home(props) {
	return (
		<div>
			<h1>Home</h1>
			<div>
				<button
					onClick={(e) => {
						e.preventDefault();

						let monsters = Object.values(Storage.monsterDict);
						monsters.sort((a, b) => sortAscending(a.Name, b.Name));

						let harvestedItems = Object.values(
							Storage.harvestableItemDict
						);
						harvestedItems.sort((a, b) =>
							sortAscending(a.ReferenceId, b.ReferenceId)
						);

						let trinketTables = Object.values(
							Storage.trinketTableDict
						);
						trinketTables.sort((a, b) =>
							sortAscending(
								a.TrinketTableType,
								b.TrinketTableType
							)
						);

						let craftableItems = Object.values(
							Storage.craftableItemDict
						);
						craftableItems.sort((a, b) =>
							sortAscending(a.Name, b.Name)
						);

						fileSaveAs(
							"system-state.json",
							JSON.stringify({
								Monsters: monsters,
								HarvestedItems: harvestedItems,
								TrinketTables: trinketTables,
								CraftableItems: craftableItems,
							})
						);
					}}
				>
					Save State
				</button>
			</div>
			<div>
				<input type="text" style={{ width: "100%", height: "4em" }} />
			</div>
			{/* <div>{JSON.stringify(props)}</div> */}
			{/* <div>{JSON.stringify(process.env)}</div> */}
		</div>
	);
}
