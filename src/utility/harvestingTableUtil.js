import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Storage from "../utility/StorageUtil";
import { getIdFromItemName } from "./craftableItemUtil";
import "./hamundsTables.css";
import { NavLink } from "reactstrap";
import { Link } from "react-router-dom";

export function HarvestingTableDisplay(props) {
	let challengeRating = props.challengeRating;
	let creatureType = props.creatureType;
	let harvestingTable = props.harvestingTable;

	let rowsOut = [];

	rowsOut.push(
		<Row className="text-center hamund-header" key={-1}>
			<Col className="col-1">DC</Col>
			<Col className="col-2 text-left">Item</Col>
			<Col className="">Description</Col>
			<Col className="col-1">Value</Col>
			<Col className="col-1">Weight</Col>
			<Col className="col-2">Crafting</Col>
		</Row>
	);

	for (let i = 0; i < harvestingTable.Rows.length; ++i) {
		let row = harvestingTable.Rows[i];

		let item = Storage.harvestableItemDict[row.ItemNameRef];

		let nameOut = row.ItemNameRef;
		let descriptionOut = [];
		let valueOut = "";
		let weightOut = "";
		let craftingOut = [];

		if (item !== null && item !== undefined) {
			nameOut = item.Name;

			let lines = 0;

			for (let j = 0; j < item.Description.length; ++j) {
				descriptionOut.push(<p key={lines++}>{item.Description[j]}</p>);
			}

			// output tools, if any
			if (
				item.RequiredToolNames !== undefined &&
				item.RequiredToolNames.length > 0
			) {
				descriptionOut.push(
					<p key={lines++} className="font-weight-bold">
						Requires{" "}
						{item.RequiredToolNames.join(" and ").toLowerCase()}.
					</p>
				);
			}

			for (let j = 0; j < item.UseText.length; ++j) {
				descriptionOut.push(
					<p key={lines++}>
						{j === 0 && <b>Use: </b>} {item.UseText[j]}
					</p>
				);
			}

			valueOut = item.ValueGP;
			weightOut = item.WeightLB;

			// craftingOut = item.CraftingUsage.join(" or ");
			for (let k = 0; k < item.CraftingUsage.length; ++k) {
				if (craftingOut.length !== 0) {
					craftingOut.push(<> or </>);
				}
				craftingOut.push(
					<NavLink
						key={k}
						tag={Link}
						to={`/craftableitems/${getIdFromItemName(
							item.CraftingUsage[0]
						)}`}
					>
						{item.CraftingUsage[0]}
					</NavLink>
				);
			}
		}

		if (row.Quantity !== "") {
			nameOut += ` (${row.Quantity})`;
		}
		if (row.Notes !== "") {
			nameOut += ` (${row.Notes})`;
		}

		rowsOut.push(
			<Row key={i} className="hamund-row">
				<Col className="col-1 text-center">{row.DifficultyClass}</Col>
				<Col className="col-2">{nameOut}</Col>
				<Col className="">{descriptionOut}</Col>
				<Col className="col-1">{valueOut}</Col>
				<Col className="col-1">{weightOut}</Col>
				<Col className="col-2">{craftingOut}</Col>
			</Row>
		);
	}

	let skill = "";

	switch (creatureType.Type) {
		case "aberration":
		case "celestial":
		case "elemental":
		case "fey":
		case "fiend":
		case "undead":
			skill = "Arcana";
			break;
		case "beast":
		case "dragon":
		case "monstrosity":
		case "plant":
			skill = "Nature";
			break;
		case "construct":
		case "ooze":
			skill = "Investigation";
			break;
		case "giant":
		case "humanoid":
			skill = "Medicine";
			break;
		default:
			skill = "[" + creatureType.Type + "]";
			break;
	}

	let apprasialTarget = "unknown";

	if (challengeRating !== null) {
		apprasialTarget = 8 + challengeRating.CR;
	}

	return (
		<Container>
			<Row>
				<b>Relevant skill:</b>&nbsp;{skill}
			</Row>
			<Row>
				<b>Appraisal Target:</b>&nbsp;{apprasialTarget}
			</Row>
			<div className="border" />
			<Container className="hamund-table">{rowsOut}</Container>
		</Container>
	);
}
