import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Storage from "../utility/StorageUtil";
// import { getIdFromItemName } from "./craftableItemUtil";
import "./hamundsTables.css";
import { NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import { AppTheme } from "../themeContext";

export function HarvestingTableDisplay(props) {
  const appTheme = useContext(AppTheme);

  let challengeRating = props.challengeRating;
  let creatureType = props.creatureType;
  let harvestingTable = props.harvestingTable;

  if (!harvestingTable) return <></>;

  let rowsOut = [];

  // rowsOut.push(<>{JSON.stringify(harvestingTable)}</>);

  rowsOut.push(
    <Row
      className={`text-center hamund-header ${appTheme.theme.styleName}`}
      key={-1}
    >
      <Col className="col-1">DC</Col>
      <Col className="col-2 text-left">Item</Col>
      <Col className="">Description</Col>
      <Col className="col-1">Value</Col>
      <Col className="col-1">Weight</Col>
      <Col className="col-2">Crafting</Col>
    </Row>
  );

  for (let i = 0; i < harvestingTable.rows.length; ++i) {
    let row = harvestingTable.rows[i];

    let item = Storage.harvestedItemDict[row.itemNameReference];

    let nameOut = row.itemNameReference;
    let descriptionOut = [];
    let valueOut = "";
    let weightOut = "";
    let craftingOut = [];

    if (item !== null && item !== undefined) {
      nameOut = item.name;

      let lines = 0;

      for (let j = 0; j < item.description.length; ++j) {
        descriptionOut.push(<p key={lines++}>{item.description[j]}</p>);
      }

      // output tools, if any
      if (
        item.requiredToolNames !== undefined &&
        item.requiredToolNames.length > 0
      ) {
        descriptionOut.push(
          <p key={lines++} className="font-weight-bold">
            Requires {item.requiredToolNames.join(" and ").toLowerCase()}.
          </p>
        );
      }

      for (let j = 0; j < item.useText.length; ++j) {
        descriptionOut.push(
          <p key={lines++}>
            {j === 0 && <b>Use: </b>} {item.useText[j]}
          </p>
        );
      }

      valueOut = item.value;
      weightOut = item.weight;

      // craftingOut = item.CraftingUsage.join(" or ");
      for (let k = 0; k < item.craftingUsage.length; ++k) {
        if (craftingOut.length !== 0) {
          craftingOut.push(<span key={"or-" + k}> or </span>);
        }
        craftingOut.push(
          <NavLink
            key={k}
            tag={Link}
            // TODO: Fix this
            // to={`/craftableitems/${getIdFromItemName(item.craftingUsage[k])}`}
          >
            {item.craftingUsage[k]}
          </NavLink>
        );
      }
    }

    if (row.quantity !== "") {
      nameOut += ` (${row.quantity})`;
    }
    if (row.notes !== "") {
      nameOut += ` (${row.notes})`;
    }

    rowsOut.push(
      <Row key={i} className={`hamund-row ${appTheme.theme.styleName}`}>
        <Col className="col-1 text-center">{row.difficultyClass}</Col>
        <Col className="col-2">{nameOut}</Col>
        <Col className="">{descriptionOut}</Col>
        <Col className="col-1">{valueOut}</Col>
        <Col className="col-1">{weightOut}</Col>
        <Col className="col-2">{craftingOut}</Col>
      </Row>
    );
  }

  let skill = "";

  switch (creatureType.type) {
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
      skill = "[" + creatureType.type + "]";
      break;
  }

  let apprasialTarget = "unknown";

  if (challengeRating !== null) {
    apprasialTarget = 8 + challengeRating.cr;
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
