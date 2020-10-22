import React from "react";
import { matchPath } from "react-router";
import { Col, Row } from "react-bootstrap";
import { DisplayList, DisplayColumn } from "./DisplayList";
import Storage from "../utility/StorageUtil";
import {
  getIdFromItem,
  CraftableItemDisplay,
  EditingCraftableItemDisplay,
} from "../utility/craftableItemUtil";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";

import "./Columnable.css";
import "../LayoutControl/Layout.css";

export function CraftableItems(props) {
  // let [filterObj, setFilterObj] = useState({});

  const pathWithId = "/craftableitems/:id";
  let craftableItem = null;

  // extract monster id from the path
  let match = matchPath(props.location.pathname, { path: pathWithId });
  let selectedId = "";
  if (match !== null) {
    // if there is an id, search for the monster
    selectedId = match.params.id;
    if (Storage.craftableItemDict[selectedId] !== undefined) {
      craftableItem = Storage.craftableItemDict[selectedId];
    }
  }

  const headers = [
    new DisplayColumn(
      "Name",
      (item) => {
        return <>{item["Name"]}</>;
      },
      (a, b) => {
        return sortStrAsc(a.Name, b.Name);
      }
    ),
  ];

  let displayOutput = ["Select an item from the list"];

  if (craftableItem !== null) {
    if (false && process.env.NODE_ENV === "development") {
      displayOutput = [
        <EditingCraftableItemDisplay craftableItem={craftableItem} key={0} />,
      ];
    } else {
      displayOutput = [
        <CraftableItemDisplay craftableItem={craftableItem} key={0} />,
      ];
    }
  }

  return (
    <>
      <Row className="h-100" xs={1} md={2}>
        <Col className="border h-100">
          {/* <MonsterFilterBlock submitFilter={setFilterObj} /> */}
          <DisplayList
            headers={headers}
            items={Object.values(Storage.craftableItemDict)}
            //filterObject={filterObj}
            pathRoot={props.match.path}
            idFunction={getIdFromItem}
            selectedId={selectedId}
          />
        </Col>
        <Col className="border scrollableColumn">{displayOutput}</Col>
      </Row>
    </>
  );
}
