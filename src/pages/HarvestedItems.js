import React, { useState } from "react";
import { matchPath } from "react-router";
import { Col, Row } from "react-bootstrap";
import { DisplayList, DisplayColumn } from "./DisplayList";
import { HarvestedItemFilterBlock } from "../components/HarvestedItemFilterBlock";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import Storage from "../utility/StorageUtil";
import {
  EditingHarvestedItemDisplay,
  HarvestedItemDisplay,
  getItemReference,
} from "../utility/harvestedItemUtil";

export function HarvestedItems(props) {
  let [filterObj, setFilterObj] = useState({});

  const pathWithId = "/harvesteditems/:id";
  let harvestedItem = null;

  // extract monster id from the path
  let match = matchPath(props.location.pathname, { path: pathWithId });
  let selectedId = "";
  if (match !== null) {
    // if there is an id, search for the monster
    selectedId = match.params.id;
    if (Storage.harvestableItemDict[selectedId] !== undefined) {
      harvestedItem = Storage.harvestableItemDict[selectedId];
    }
  }

  const headers = [
    new DisplayColumn(
      "Name",
      (item) => {
        return <>{item["name"]}</>;
      },
      (a, b) => {
        return sortStrAsc(a.name, b.name);
      }
    ),
  ];

  let harvestedOutput = ["Select an item from the list"];

  if (harvestedItem !== null) {
    if (false && process.env.NODE_ENV === "development") {
      harvestedOutput = [
        <EditingHarvestedItemDisplay harvestedItem={harvestedItem} />,
      ];
    } else {
      harvestedOutput = [
        <HarvestedItemDisplay harvestedItem={harvestedItem} />,
      ];
    }
  }

  return (
    <>
      <Row className="h-100" xs={1} md={2}>
        <Col className="border h-100">
          <HarvestedItemFilterBlock submitFilter={setFilterObj} />
          <DisplayList
            headers={headers}
            items={Object.values(Storage.harvestableItemDict)}
            filterObject={filterObj}
            pathRoot={props.match.path}
            idFunction={getItemReference}
            selectedId={selectedId}
          />
        </Col>
        <Col className="border scrollableColumn">{harvestedOutput}</Col>
      </Row>
    </>
  );
}
