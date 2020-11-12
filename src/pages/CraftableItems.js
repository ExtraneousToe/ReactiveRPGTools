import "../css/Columnable.css";
import "../css/Layout.css";

import React from "react";
import { matchPath } from "react-router";
import { Col, Row } from "reactstrap";
import CraftableItemDisplay from "../components/CraftableItemDisplay";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import { ModularDisplayList, MDColumn } from "../components/ModularDisplayList";
import { getCraftableItemDict } from "../redux/selectors";
import { connect } from "react-redux";

const selectors = (store) => ({
  craftableItemDict: getCraftableItemDict(store),
});

export default connect(selectors)(CraftableItems);

function CraftableItems(props) {
  const pathWithId = "/craftableitems/:id";
  let craftableItem = null;

  // extract monster id from the path
  let match = matchPath(props.location.pathname, { path: pathWithId });
  let selectedId = "";
  if (match !== null) {
    // if there is an id, search for the monster
    selectedId = match.params.id;
    if (props.craftableItemDict[selectedId] !== undefined) {
      craftableItem = props.craftableItemDict[selectedId];
    }
  }

  const headers = [
    // new DisplayColumn(
    new MDColumn(
      "Name",
      (item) => {
        return <>{item["name"]}</>;
      },
      (a, b) => {
        return sortStrAsc(a.name, b.name);
      }
    ),
  ];

  let displayOutput = ["Select an item from the list"];

  if (craftableItem !== null) {
    displayOutput[0] = (
      <CraftableItemDisplay craftableItem={craftableItem} key={0} />
    );
  }

  return (
    <>
      <Row className="h-100" xs={1} md={2}>
        <Col className="border h-100">
          <ModularDisplayList
            headers={headers}
            items={Object.values(props.craftableItemDict)}
            pathRoot={props.match.path}
            selectedId={selectedId}
            height={600}
            itemSize={25}
          />
        </Col>
        <Col className="border scrollableColumn">{displayOutput}</Col>
      </Row>
    </>
  );
}
